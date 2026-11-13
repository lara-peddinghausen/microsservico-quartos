import { PartialType } from '@nestjs/swagger';
import { CreateTipoQuartoDto } from './create-tipo-quarto.dto';

export class UpdateTipoQuartoDto extends PartialType(
  CreateTipoQuartoDto,
) {}