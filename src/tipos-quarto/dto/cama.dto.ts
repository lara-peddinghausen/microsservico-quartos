
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';
import { cama_tipo_cama } from '../../generated/prisma/client.js';

export class CamaDto {

    // Tipo de cama
    @ApiProperty({
        description: 'Tipo de cama',
        enum: cama_tipo_cama,
        example: cama_tipo_cama.CASAL,
    })
    @IsEnum(cama_tipo_cama, {
        message: 'Tipo de cama inválido',
    })
    tipo_cama!: cama_tipo_cama;

    // Quantidade
    @ApiProperty({
        description: 'Quantidade de camas deste tipo',
        example: 1,
        minimum: 1,
    })
    @IsInt({
        message: 'A quantidade de camas deve ser um número inteiro',
    })
    @Min(1, {
        message: 'A quantidade de camas deve ser maior que zero',
    })
    quantidade!: number;
}
