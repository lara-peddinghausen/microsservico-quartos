
import { Body, Controller, Post, Get, Param, Patch } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { QuartosService } from './quartos.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { Query } from '@nestjs/common';
import { FiltroQuartosDto } from './dto/filtro-quartos.dto';

@ApiTags('Quartos')
@Controller('quartos')
export class QuartosController {
  constructor(
    private readonly quartosService: QuartosService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Cadastrar quarto',
    description:
      'Cadastra um quarto associado a um tipo de quarto existente. ' +
      'A disponibilidade inicial é definida automaticamente conforme o status.',
  })
  @ApiCreatedResponse({
    description: 'Quarto cadastrado com sucesso.',
    schema: {
      example: {
        id: '1',
        id_tipo_quarto: '1',
        numero: 101,
        status: 'ATIVO',
        disponibilidade: 'DISPONIVEL',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Tipo de quarto não encontrado.',
  })
  @ApiConflictResponse({
    description: 'Número de quarto já cadastrado.',
  })
  create(@Body() dto: CreateQuartoDto) {
    return this.quartosService.create(dto);
  }


  @Get()
  @ApiOperation({
    summary: 'Listar quartos',
    description:
      'Lista os quartos cadastrados, permitindo filtrar por tipo de quarto, status e número.',
  })
  @ApiOkResponse({
    description: 'Lista de quartos retornada com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de filtro inválidos.',
  })
  async findAll(@Query() filtros: FiltroQuartosDto) {
    return this.quartosService.findAll(filtros);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar quarto por ID',
    description: 'Retorna os dados de um quarto específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do quarto.',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Quarto encontrado.',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Quarto não encontrado.',
  })
  findById(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.quartosService.findById(id);
  }


  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar quarto',
    description:
      'Atualiza os dados administrativos de um quarto. ' +
      'A disponibilidade não pode ser alterada diretamente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do quarto.',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Quarto atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'Quarto ou tipo de quarto não encontrado.',
  })
  @ApiConflictResponse({
    description: 'Número de quarto já cadastrado.',
  })
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateQuartoDto,
  ) {
    return this.quartosService.update(id, dto);
  }


}
