
import { Body, Controller, Post, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { TiposQuartoService } from './tipos-quarto.service.js';
import { CreateTipoQuartoDto } from './dto/create-tipo-quarto.dto.js';
import { UpdateTipoQuartoDto } from './dto/update-tipo-quarto.dto.js';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe.js';

@ApiTags('Tipos de Quarto')
@Controller('tipos-quarto')
export class TiposQuartoController {
  constructor(
    private readonly tiposQuartoService: TiposQuartoService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os tipos de quarto',
  })
  @ApiOkResponse({
    description: 'Lista de tipos de quarto retornada com sucesso',
  })
  findAll() {
    return this.tiposQuartoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar tipo de quarto por ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do tipo de quarto',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Tipo de quarto encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  @ApiNotFoundResponse({
    description: 'Tipo de quarto não encontrado',
  })
  findById(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.tiposQuartoService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cadastrar um tipo de quarto',
  })
  @ApiCreatedResponse({
    description: 'Tipo de quarto cadastrado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou obrigatórios não informados',
  })
  @ApiConflictResponse({
    description: 'Já existe um tipo de quarto com este nome',
  })
  create(@Body() data: CreateTipoQuartoDto) {
    return this.tiposQuartoService.create(data);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar parcialmente um tipo de quarto',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do tipo de quarto',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Tipo de quarto atualizado com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'ID ou dados de atualização inválidos',
  })
  @ApiNotFoundResponse({
    description: 'Tipo de quarto não encontrado',
  })
  @ApiConflictResponse({
    description: 'Já existe um tipo de quarto com este nome',
  })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() data: UpdateTipoQuartoDto,
  ) {
    return this.tiposQuartoService.update(id, data);
  }
}
