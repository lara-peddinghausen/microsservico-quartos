import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTipoQuartoDto } from './dto/create-tipo-quarto.dto.js';
import { UpdateTipoQuartoDto } from './dto/update-tipo-quarto.dto.js';

@Injectable()
export class TiposQuartoService {
  constructor(private readonly prisma: PrismaService) { }

  private formatarTipoQuarto(
    tipoQuarto: Prisma.tipo_quartoGetPayload<{
      include: {
        tipo_quarto_comodidade: {
          include: {
            comodidade: true;
          };
        };
      };
    }>,
  ) {
    const { tipo_quarto_comodidade, ...dadosTipoQuarto } = tipoQuarto;

    return {
      ...dadosTipoQuarto,
      id: tipoQuarto.id.toString(),

      comodidades: tipo_quarto_comodidade.map((associacao) => ({
        id: associacao.comodidade.id.toString(),
        nome: associacao.comodidade.nome,
      })),
    };
  }

  async findAll() {
    const tiposQuarto = await this.prisma.tipo_quarto.findMany({
      include: {
        tipo_quarto_comodidade: {
          include: {
            comodidade: true,
          },
        },
      },
    });

    return tiposQuarto.map((tipoQuarto) =>
      this.formatarTipoQuarto(tipoQuarto),
    );
  }

  async findById(id: bigint) {
    const tipoQuarto = await this.prisma.tipo_quarto.findUnique({
      where: { id },
      include: {
        tipo_quarto_comodidade: {
          include: {
            comodidade: true,
          },
        },
      },
    });

    if (!tipoQuarto) {
      throw new NotFoundException('Tipo de quarto não encontrado');
    }

    return this.formatarTipoQuarto(tipoQuarto);
  }

  async create(data: CreateTipoQuartoDto) {
    const { comodidades, ...dadosTipoQuarto } = data;  // Separa o array de comodidades dos demais campos, pois comodidades não é uma coluna da tabela tipo_quarto.

    // Verifica se todas as comodidades informadas existem
    if (comodidades?.length) {
      const ids = comodidades.map((id) => BigInt(id));

      // Consulta quais comodidades existem no banco.
      const existentes = await this.prisma.comodidade.findMany({
        where: {
          id: { in: ids },
        },
        select: { id: true },
      });

      if (existentes.length !== ids.length) {
        throw new NotFoundException(
          'Uma ou mais comodidades não foram encontradas',
        );
      }
    }

    try {
      // Cadastra o tipo de quarto e suas associações
      const tipoQuarto = await this.prisma.tipo_quarto.create({
        data: {
          ...dadosTipoQuarto,

          tipo_quarto_comodidade: {
            create: (comodidades ?? []).map((id) => ({
              comodidade: {
                connect: { id: BigInt(id) },
              },
            })),
          },
        },
        include: {
          tipo_quarto_comodidade: {
            include: {
              comodidade: true,
            },
          },
        },
      });

      // Converte os IDs BigInt antes de retornar JSON
      return this.formatarTipoQuarto(tipoQuarto);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um tipo de quarto com este nome',
        );
      }

      throw error;
    }
  }



  async update(id: bigint, data: UpdateTipoQuartoDto) {
    await this.findById(id);

    const { comodidades, ...dadosTipoQuarto } = data;

    // Valida se as comodidades informadas existem
    if (comodidades !== undefined) {
      const ids = comodidades.map((id) => BigInt(id));

      const existentes = await this.prisma.comodidade.findMany({
        where: {
          id: { in: ids },
        },
        select: { id: true },
      });

      if (existentes.length !== ids.length) {
        throw new NotFoundException(
          'Uma ou mais comodidades não foram encontradas',
        );
      }
    }

    try {
      const tipoQuarto = await this.prisma.tipo_quarto.update({
        where: { id },
        data: {
          ...dadosTipoQuarto,

          // Só altera as associações se o campo for enviado
          ...(comodidades !== undefined && {
            tipo_quarto_comodidade: {
              deleteMany: {},  // remove as associações anteriores somente daquele tipo de quarto, não exclui os registros da tabela comodidade.
              create: comodidades.map((id) => ({  // adiciona as novas associações.
                comodidade: {
                  connect: { id: BigInt(id) },
                },
              })),
            },
          }),
        },
        include: {
          tipo_quarto_comodidade: {
            include: {
              comodidade: true,
            },
          },
        },
      });

      return this.formatarTipoQuarto(tipoQuarto);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um tipo de quarto com este nome',
        );
      }

      throw error;
    }
  }

}