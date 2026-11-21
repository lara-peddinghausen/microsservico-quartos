
import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { QuartosService } from './quartos.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

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
    description: 'Retorna todos os quartos cadastrados e seus tipos.',
  })
  @ApiOkResponse({
    description: 'Lista de quartos retornada com sucesso.',
  })
  findAll() {
    return this.quartosService.findAll();
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

}
