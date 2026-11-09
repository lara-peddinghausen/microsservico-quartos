import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateComodidadeDto } from './dto/create-comodidades.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class ComodidadesService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll() {
        const comodidades = await this.prisma.comodidade.findMany();

        return comodidades.map((comodidade) => ({
            ...comodidade,
            id: comodidade.id.toString(),
        }));
    }

    async findById(id: bigint) {
        const comodidade = await this.prisma.comodidade.findUnique({
            where: { id },
        });

        if (!comodidade) {
            throw new NotFoundException('Comodidade não encontrada');
        }

        return {
            ...comodidade,
            id: comodidade.id.toString(),
        };
    }

    async create(data: CreateComodidadeDto) {
        try {
            const comodidade = await this.prisma.comodidade.create({
                data: {
                    nome: data.nome,
                },
            });

            return {
                ...comodidade,
                id: comodidade.id.toString(),
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'Já existe uma comodidade cadastrada com este nome',
                );
            }

            throw error;
        }
    }

    async delete(id: bigint) {
        // Verifica se a comodidade existe
        const comodidade = await this.prisma.comodidade.findUnique({
            where: { id },
        });

        if (!comodidade) {
            throw new NotFoundException('Comodidade não encontrada');
        }

        // Verifica se está vinculada a algum tipo de quarto
        const vinculacao = await this.prisma.tipo_quarto_comodidade.findFirst({
            where: {
                id_comodidade: id,
            },
        });

        if (vinculacao) {
            throw new ConflictException(
                'Não é possível excluir uma comodidade vinculada a um tipo de quarto',
            );
        }

        // Exclui somente se não houver vínculos
        await this.prisma.comodidade.delete({
            where: { id },
        });
    }
}