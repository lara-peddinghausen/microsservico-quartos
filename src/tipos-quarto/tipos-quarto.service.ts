import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTipoQuartoDto } from './dto/create-tipo-quarto.dto.js';
import { UpdateTipoQuartoDto } from './dto/update-tipo-quarto.dto.js';

@Injectable()
export class TiposQuartoService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    const tiposQuarto = await this.prisma.tipo_quarto.findMany();

    return tiposQuarto.map((tipoQuarto) => ({
      ...tipoQuarto,
      id: tipoQuarto.id.toString(),
    }));
  }

  async findById(id: bigint) {
    const tipoQuarto = await this.prisma.tipo_quarto.findUnique({
      where: { id },
    });

    if (!tipoQuarto) {
      throw new NotFoundException('Tipo de quarto não encontrado');
    }

    return {
      ...tipoQuarto,
      id: tipoQuarto.id.toString(),
    };
  }


  async create(data: CreateTipoQuartoDto) {
    try {
      const tipoQuarto = await this.prisma.tipo_quarto.create({
        data: {
          nome: data.nome,
          descricao: data.descricao,
          capacidade_maxima: data.capacidade_maxima,
          acessibilidade: data.acessibilidade,
          preco_diaria: data.preco_diaria,
          area: data.area,
        },
      });

      return {
        ...tipoQuarto,
        id: tipoQuarto.id.toString(),
      };
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
    await this.findById(id);  // Verifica se o registro existe antes de atualizar

    try {
      const tipoQuarto = await this.prisma.tipo_quarto.update({
        where: { id },
        data,
      });

      return {
        ...tipoQuarto,
        id: tipoQuarto.id.toString(),
      };
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