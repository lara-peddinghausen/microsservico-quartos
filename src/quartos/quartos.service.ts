
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { quarto_disponibilidade, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { FiltroQuartosDto } from './dto/filtro-quartos.dto';
import { ReservasClientService } from '../integracoes/reservas/reservas-client.service';

@Injectable()
export class QuartosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reservasClient: ReservasClientService,
  ) { }

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

  async findAll(filtros: FiltroQuartosDto) {
    const where: Prisma.quartoWhereInput = {};  // Prisma.quartoWhereInput é um tipo gerado pelo Prisma que representa os filtros aceitos na consulta da tabela quarto.

    if (filtros.id_tipo_quarto !== undefined) {
      where.id_tipo_quarto = BigInt(filtros.id_tipo_quarto);
    }

    if (filtros.status !== undefined) {
      where.status = filtros.status;
    }

    if (filtros.numero !== undefined) {
      where.numero = filtros.numero;
    }

    const quartos = await this.prisma.quarto.findMany({
      where,
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
            capacidade_maxima: true,
            preco_diaria: true,
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
        capacidade_maxima?: number;
        preco_diaria?: Prisma.Decimal;
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
        ...(quarto.tipo_quarto.capacidade_maxima !== undefined && {
          capacidade_maxima: quarto.tipo_quarto.capacidade_maxima,
        }),
        ...(quarto.tipo_quarto.preco_diaria !== undefined && {
          preco_diaria: quarto.tipo_quarto.preco_diaria.toString(),
        }),
      },
    };
  }


  async update(id: bigint, dto: UpdateQuartoDto) {
    // Verifica se o quarto existe
    const quartoExistente = await this.prisma.quarto.findUnique({
      where: { id },
    });

    if (!quartoExistente) {
      throw new NotFoundException('Quarto não encontrado.');
    }

    // Verifica se a inativação precisa ser validada em Reservas
    const deveValidarInativacao =
      quartoExistente.status === 'ATIVO' &&
      dto.status === 'INATIVO';

    if (deveValidarInativacao) {
      const possuiReservasBloqueantes =
        await this.reservasClient.possuiReservasBloqueantes(id);

      if (possuiReservasBloqueantes) {
        throw new ConflictException(
          'Não é possível inativar um quarto com reservas pendentes de pagamento ou confirmadas, vigentes ou futuras, ou com hospedagem em andamento.',
        );
      }
    }

    // Verifica se o novo tipo de quarto existe
    if (dto.id_tipo_quarto !== undefined) {
      const tipoQuarto = await this.prisma.tipo_quarto.findUnique({
        where: { id: BigInt(dto.id_tipo_quarto) },
      });

      if (!tipoQuarto) {
        throw new NotFoundException('Tipo de quarto não encontrado.');
      }
    }

    // Verifica se o número já pertence a outro quarto
    if (dto.numero !== undefined) {
      const quartoMesmoNumero = await this.prisma.quarto.findUnique({
        where: { numero: dto.numero },
      });

      if (quartoMesmoNumero && quartoMesmoNumero.id !== id) {
        throw new ConflictException(
          'Já existe um quarto com esse número.',
        );
      }
    }

    try {
      const quarto = await this.prisma.quarto.update({
        where: { id },
        data: {
          ...(dto.id_tipo_quarto !== undefined && {
            id_tipo_quarto: BigInt(dto.id_tipo_quarto),
          }),
          ...(dto.numero !== undefined && {
            numero: dto.numero,
          }),
          ...(dto.status !== undefined && {
            status: dto.status,
            disponibilidade:
              dto.status === 'ATIVO' ? 'DISPONIVEL' : 'INDISPONIVEL',
          }),
        },
        include: {
          tipo_quarto: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      });

      return this.formatarQuarto(quarto);
    } catch (erro) {
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

  async findQuartosDisponiveis(checkin: string, checkout: string) {
    const quartos = await this.prisma.quarto.findMany({
      where: {
        status: 'ATIVO',
        disponibilidade: 'DISPONIVEL',
      },
      include: {
        tipo_quarto: true,
      },
    });

    if (quartos.length === 0) {
      return [];
    }

    const quartosIndisponiveis =
      await this.reservasClient.consultarQuartosIndisponiveis(
        quartos.map((quarto) => quarto.id),
        checkin,
        checkout,
      );

    const idsIndisponiveis = new Set(quartosIndisponiveis);

    return quartos
      .filter(
        (quarto) => !idsIndisponiveis.has(quarto.id.toString()),
      )
      .map((quarto) => ({
        id: quarto.id.toString(),
        id_tipo_quarto: quarto.id_tipo_quarto.toString(),
        numero: quarto.numero,
        status: quarto.status,
        disponibilidade: quarto.disponibilidade,
        tipo_quarto: {
          id: quarto.tipo_quarto.id.toString(),
          nome: quarto.tipo_quarto.nome,
          capacidade_maxima: quarto.tipo_quarto.capacidade_maxima,
          preco_diaria: quarto.tipo_quarto.preco_diaria.toString(),
        },
      }));
  }



}
