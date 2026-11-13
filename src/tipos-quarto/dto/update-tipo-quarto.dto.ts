import { PartialType } from '@nestjs/swagger';
import { CreateTipoQuartoDto } from './create-tipo-quarto.dto.js';

export class UpdateTipoQuartoDto extends PartialType(
  CreateTipoQuartoDto,
  { skipNullProperties: false },
) {}