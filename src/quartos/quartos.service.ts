
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { quarto_disponibilidade, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';

@Injectable()
export class QuartosService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateQuartoDto) {
    // Verifica se o tipo de quarto existe
    const tipoQuarto = await this.prisma.tipo_quarto.findUnique({
      where: {
        id: BigInt(dto.id_tipo_quarto),
      },
    });

    if (!tipoQuarto) {
      throw new NotFoundException(
        'Tipo de quarto não encontrado.',
      );
    }

    // Verifica se o número já está cadastrado
    const quartoExistente = await this.prisma.quarto.findUnique({
      where: {
        numero: dto.numero,
      },
    });

    if (quartoExistente) {
      throw new ConflictException(
        'Já existe um quarto com esse número.',
      );
    }

    // Cadastra o quarto
    try {
      const quarto = await this.prisma.quarto.create({
        data: {
          id_tipo_quarto: BigInt(dto.id_tipo_quarto),
          numero: dto.numero,
          status: dto.status,
          disponibilidade:
            dto.status === 'ATIVO'
              ? quarto_disponibilidade.DISPONIVEL
              : quarto_disponibilidade.INDISPONIVEL,
        },
      });

      return {
        id: quarto.id.toString(),
        id_tipo_quarto: quarto.id_tipo_quarto.toString(),
        numero: quarto.numero,
        status: quarto.status,
        disponibilidade: quarto.disponibilidade,
      };
    } catch (erro) {
      // Trata possível duplicidade em requisições simultâneas
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe um quarto com esse número.',
        );
      }

      throw erro;
    }
  }


  async findAll() {
    const quartos = await this.prisma.quarto.findMany({
      include: {
        tipo_quarto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        numero: 'asc',
      },
    });

    return quartos.map((quarto) => this.formatarQuarto(quarto));
  }

  async findById(id: bigint) {
    const quarto = await this.prisma.quarto.findUnique({
      where: { id },
      include: {
        tipo_quarto: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    if (!quarto) {
      throw new NotFoundException('Quarto não encontrado.');
    }

    return this.formatarQuarto(quarto);
  }

  private formatarQuarto(
    quarto: {
      id: bigint;
      id_tipo_quarto: bigint;
      numero: number;
      status: string;
      disponibilidade: string;
      tipo_quarto: {
        id: bigint;
        nome: string;
      };
    },
  ) {
    return {
      id: quarto.id.toString(),
      id_tipo_quarto: quarto.id_tipo_quarto.toString(),
      numero: quarto.numero,
      status: quarto.status,
      disponibilidade: quarto.disponibilidade,
      tipo_quarto: {
        id: quarto.tipo_quarto.id.toString(),
        nome: quarto.tipo_quarto.nome,
      },
    };
  }

}
