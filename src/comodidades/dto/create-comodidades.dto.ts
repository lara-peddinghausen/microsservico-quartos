import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateComodidadeDto {
    @ApiProperty({
        description: 'Nome da comodidade',
        example: 'Wi-Fi',
        maxLength: 100,
        required: true,
    })

    @IsString({ message: 'Nome deve ser um texto' })
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @MaxLength(100, {
    message: 'Nome deve ter no máximo 100 caracteres',
  })
    nome!: string;
}