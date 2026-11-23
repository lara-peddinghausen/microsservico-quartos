
import { Body, Controller, Post, Get, Param, Patch, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Delete, HttpCode, HttpStatus, Res, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse, ApiConsumes, ApiBody, ApiNoContentResponse, ApiQuery } from '@nestjs/swagger';
import { TiposQuartoService } from './tipos-quarto.service.js';
import { CreateTipoQuartoDto } from './dto/create-tipo-quarto.dto.js';
import { UpdateTipoQuartoDto } from './dto/update-tipo-quarto.dto.js';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { FotosService } from './fotos.service.js';
import type { Response } from 'express';
import { validarPeriodo } from '../common/utils/validar-periodo';

@ApiTags('Tipos de Quarto')
@Controller('tipos-quarto')
export class TiposQuartoController {
  constructor(
    private readonly tiposQuartoService: TiposQuartoService,
    private readonly fotosService: FotosService,
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os tipos de quarto',
    description:
      'Retorna todos os tipos de quarto cadastrados, incluindo suas comodidades, camas e fotos.',
  })
  @ApiOkResponse({
    description: 'Lista de tipos de quarto retornada com sucesso',
  })
  findAll() {
    return this.tiposQuartoService.findAll();
  }

  @Get('disponiveis')  // recebe as datas, valida o período e chama o método findDisponiveis no TiposQuartoService
  @ApiOperation({
    summary: 'Consultar tipos de quarto disponíveis',
    description:
      'Retorna os tipos de quarto que possuem pelo menos uma unidade disponível no período informado.',
  })
  @ApiQuery({
    name: 'checkin',
    type: String,
    example: '2026-12-10',
    description: 'Data de entrada (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'checkout',
    type: String,
    example: '2026-12-15',
    description: 'Data de saída (YYYY-MM-DD)',
  })
  @ApiOkResponse({
    description: 'Tipos de quarto disponíveis retornados com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Datas inválidas ou período incorreto',
  })
  async findDisponiveis(
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string,
  ) {
    validarPeriodo(checkin, checkout);

    return this.tiposQuartoService.findTiposDisponiveis(
      checkin,
      checkout,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar tipo de quarto por ID',
    description:
      'Retorna os dados de um tipo de quarto específico, incluindo suas comodidades, camas e fotos.',
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
    description:
      'Cadastra um novo tipo de quarto com suas informações, comodidades e camas associadas. As fotos são adicionadas posteriormente pela rota de upload.',
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
    description:
      'Atualiza os dados de um tipo de quarto existente. Quando informadas, as listas de comodidades e camas substituem as associações anteriores. As fotos são gerenciadas por rotas específicas.',
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


  @Post(':id/fotos')
  @ApiOperation({
    summary: 'Adicionar foto ao tipo de quarto',
    description:
      'Recebe uma imagem JPEG, PNG ou WebP de até 40 KB, converte para Base64 e a associa ao tipo de quarto informado.',
  })
  @ApiConsumes('multipart/form-data')  // Informa ao Swagger que receberemos um formulário com arquivo
  @ApiBody({  // Exibe o seletor de arquivos no Swagger
    schema: {
      type: 'object',
      properties: {
        arquivo: {
          type: 'string',
          format: 'binary',
          description: 'Imagem JPEG, PNG ou WebP (máximo 40 KB)',
        },
      },
      required: ['arquivo'],
    },
  })
  @ApiCreatedResponse({
    description: 'Foto cadastrada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Arquivo inválido ou imagem acima do tamanho permitido',
  })
  @ApiNotFoundResponse({
    description: 'Tipo de quarto não encontrado',
  })
  @UseInterceptors(
    FileInterceptor('arquivo', {  // Processa o upload
      limits: {
        fileSize: 40 * 1024,
      },
    }),
  )
  async adicionarFoto(
    @Param('id', ParseBigIntPipe) id: bigint,
    @UploadedFile(
      new ParseFilePipe({  // Valida o arquivo
        validators: [
          new MaxFileSizeValidator({
            maxSize: 40 * 1024,
          }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    arquivo: Express.Multer.File,
  ) {
    return this.fotosService.create(id, arquivo);  // Converte para Base64 e salva no banco
  }


  @Delete(':id/fotos/:fotoId')
  @ApiOperation({
    summary: 'Excluir foto do tipo de quarto',
    description:
      'Exclui uma foto associada ao tipo de quarto informado. Retorna 404 caso o tipo de quarto ou a foto não exista, ou caso a foto não pertença ao tipo de quarto.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Foto excluída com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Tipo de quarto ou foto não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  async removerFoto(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Param('fotoId', ParseBigIntPipe) fotoId: bigint,
  ): Promise<void> {
    await this.fotosService.remove(id, fotoId);
  }


  @Get(':id/fotos/:fotoId')
  @ApiOperation({
    summary: 'Visualizar foto do tipo de quarto',
    description:
      'Retorna a imagem cadastrada em seu formato original (JPEG, PNG ou WebP), permitindo sua visualização diretamente no navegador.',
  })
  @ApiOkResponse({
    description: 'Imagem retornada com sucesso',
    content: {
      'image/jpeg': {
        schema: { type: 'string', format: 'binary' },
      },
      'image/png': {
        schema: { type: 'string', format: 'binary' },
      },
      'image/webp': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Tipo de quarto ou foto não encontrada',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  async visualizarFoto(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Param('fotoId', ParseBigIntPipe) fotoId: bigint,
    @Res() resposta: Response,
  ): Promise<void> {
    const { buffer, tipoMime } = await this.fotosService.findImage(
      id,
      fotoId,
    );

    resposta.setHeader('Content-Type', tipoMime);
    resposta.setHeader('Content-Disposition', 'inline');  // Indica que a imagem pode ser exibida no navegador
    resposta.send(buffer);
  }


}
