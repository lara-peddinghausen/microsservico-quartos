import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ComodidadesService } from './comodidades.service.js';
import { CreateComodidadeDto } from './dto/create-comodidades.dto.js';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe.js';

@ApiTags('Comodidades')
@Controller('comodidades')
export class ComodidadesController {
  constructor(
    private readonly comodidadesService: ComodidadesService,
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as comodidades',
    description: 'Retorna todas as comodidades cadastradas.',
  })
  @ApiOkResponse({
    description: 'Lista de comodidades retornada com sucesso.',
    schema: {
      example: [
        { id: '1', nome: 'Wi-Fi' },
        { id: '2', nome: 'Ar-condicionado' },
      ],
    },
  })
  findAll() {
    return this.comodidadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar comodidade por ID',
    description: 'Retorna uma comodidade pelo identificador.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador da comodidade',
    example: '1',
    type: String,
  })
  @ApiOkResponse({
    description: 'Comodidade encontrada.',
    schema: {
      example: { id: '1', nome: 'Wi-Fi' },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Comodidade não encontrada.',
  })
  findById(
    @Param('id', ParseBigIntPipe) id: bigint,
  ) {
    return this.comodidadesService.findById(id);
  }

   @Post()
  @ApiOperation({
    summary: 'Cadastrar comodidade',
    description: 'Cadastra uma nova comodidade.',
  })
  @ApiCreatedResponse({
    description: 'Comodidade cadastrada com sucesso.',
    schema: {
      example: { id: '3', nome: 'Televisão' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou nome não informado.',
  })
  @ApiConflictResponse({
    description: 'Já existe uma comodidade com este nome.',
  })
  create(@Body() data: CreateComodidadeDto) {
    return this.comodidadesService.create(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir comodidade',
    description:
      'Exclui uma comodidade que não esteja vinculada a um tipo de quarto.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador da comodidade',
    example: '1',
    type: String,
  })
  @ApiNoContentResponse({
    description: 'Comodidade excluída com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Comodidade não encontrada.',
  })
  @ApiConflictResponse({
    description:
      'Não é possível excluir uma comodidade vinculada a um tipo de quarto.',
  })
  async delete(
    @Param('id', ParseBigIntPipe) id: bigint,
  ) {
    await this.comodidadesService.delete(id);
  }
}