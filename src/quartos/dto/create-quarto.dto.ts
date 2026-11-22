
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Max, Min } from 'class-validator';
import { quarto_status } from '../../generated/prisma/client';


export class CreateQuartoDto {
  @ApiProperty({
    example: 1,
    description: 'ID do tipo de quarto associado.',
  })
  @IsInt({
    message: 'O ID do tipo de quarto deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'O ID do tipo de quarto deve ser maior que zero.',
  })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'O ID do tipo de quarto excede o valor máximo permitido.',
  })
  id_tipo_quarto!: number;

  @ApiProperty({
    example: 101,
    description: 'Número único do quarto.',
  })
  @IsInt({
    message: 'O número do quarto deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'O número do quarto deve ser maior que zero.',
  })
  numero!: number;

  @ApiProperty({
    enum: quarto_status,
    example: quarto_status.ATIVO,
    description: 'Status administrativo do quarto.',
  })
  @IsEnum(quarto_status, {
    message: 'Status inválido. Os valores permitidos são ATIVO ou INATIVO.',
  })
  status!: quarto_status;
}

