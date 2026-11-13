import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional, IsNumber, MaxLength, Min, IsArray, ArrayUnique, ValidateIf, Max, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CamaDto } from './cama.dto.js';

export class CreateTipoQuartoDto {

  // Nome
  @ApiProperty({
    description: 'Nome único que identifica a categoria do quarto',
    example: 'Quarto Deluxe',
    maxLength: 100,
  })

  @IsString({ message: 'Nome deve ser um texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100, {
    message: 'Nome deve ter no máximo 100 caracteres',
  })
  nome!: string;


  // Descrição
  @ApiPropertyOptional({
    description: 'Descrição das características do tipo de quarto',
    example: 'Quarto com vista para o mar',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser um texto' })
  @MaxLength(500, {
    message: 'Descrição deve ter no máximo 500 caracteres',
  })
  descricao?: string;


  // Capacidade
  @ApiProperty({
    description: 'Número máximo de hóspedes permitidos',
    example: 2,
    minimum: 1,
  })

  @IsInt({ message: 'Capacidade máxima deve ser um número inteiro' })
  @Min(1, {
    message: 'Capacidade máxima deve ser maior ou igual a 1',
  })
  capacidade_maxima!: number;


  // Acessibilidade
  @ApiProperty({
    description: 'Indica se o tipo de quarto possui recursos de acessibilidade',
    example: false
  })

  @IsBoolean({ message: 'Acessibilidade deve ser um booleano' })
  acessibilidade!: boolean;


  // Preço da diária
  @ApiProperty({
    description: 'Valor da diária do tipo de quarto em reais (R$)',
    example: 350.00,
    minimum: 0,
  })

  @IsNumber({ maxDecimalPlaces: 2 }, {
    message: 'Preço da diária deve ser um número com no máximo 2 casas decimais'
  })
  @Min(0, {
    message: 'Preço da diária não pode ser menor do que zero',
  })
  preco_diaria!: number;


  // Área
  @ApiPropertyOptional({
    description: 'Área do tipo de quarto em metros quadrados (m²)',
    example: 28.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Área deve ser um número com no máximo 2 casas decimais' },
  )
  @Min(0, {
    message: 'Área não pode ser menor do que zero',
  })
  area?: number;


  // Comodidades
  @ApiPropertyOptional({
    description: 'IDs das comodidades associadas ao tipo de quarto',
    example: [1, 2, 3],
    type: [Number],
  })

  @ValidateIf((_, value) => value !== undefined)
  @IsArray({ message: 'Comodidades deve ser uma lista de IDs' })
  @ArrayUnique({ message: 'Não é permitido repetir comodidades' })
  @IsInt({
    each: true,
    message: 'Cada ID de comodidade deve ser um número inteiro',
  })
  @Min(1, {
    each: true,
    message: 'Cada ID de comodidade deve ser maior que zero',
  })
  @Max(Number.MAX_SAFE_INTEGER, {
    each: true,
    message: 'Cada ID de comodidade excede o limite permitido',
  })
  comodidades?: number[];


  // Camas
  @ApiPropertyOptional({
    description: 'Configurações de camas do tipo de quarto',
    type: [CamaDto],
    example: [
      { tipo_cama: 'CASAL', quantidade: 1 },
      { tipo_cama: 'SOLTEIRO', quantidade: 1 },
    ],
  })

  @ValidateIf((_, value) => value !== undefined)
  @IsArray({ message: 'Camas deve ser uma lista de IDs' })
  @ValidateNested({ each: true })
  @Type(() => CamaDto)
  camas?: CamaDto[];
}