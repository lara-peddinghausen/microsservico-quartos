import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateComodidadeDto } from './dto/create-comodidades.dto.js';

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
        const comodidade = await this.prisma.comodidade.create({
            data: {
                nome: data.nome,
            },
        });

        return {
            ...comodidade,
            id: comodidade.id.toString(),
        };
    }

    async delete(id: bigint) {
        await this.findById(id);

        return this.prisma.comodidade.delete({
            where: { id },
        });
    }
}