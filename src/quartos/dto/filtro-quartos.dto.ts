
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { quarto_status } from '../../generated/prisma/client';

export class FiltroQuartosDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtra os quartos pelo ID do tipo de quarto.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'O ID do tipo de quarto deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'O ID do tipo de quarto deve ser maior que zero.',
  })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'O ID do tipo de quarto excede o valor máximo permitido.',
  })
  id_tipo_quarto?: number;

  @ApiPropertyOptional({
    enum: quarto_status,
    example: quarto_status.ATIVO,
    description: 'Filtra os quartos pelo status administrativo.',
  })
  @IsOptional()
  @IsEnum(quarto_status, {
    message: 'Status inválido. Os valores permitidos são ATIVO ou INATIVO.',
  })
  status?: quarto_status;

  @ApiPropertyOptional({
    example: 101,
    description: 'Filtra os quartos pelo número.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'O número do quarto deve ser um número inteiro.',
  })
  @Min(1, {
    message: 'O número do quarto deve ser maior que zero.',
  })
  numero?: number;
}
