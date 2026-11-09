import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ComodidadesService } from './comodidades.service.js';
import { CreateComodidadeDto } from './dto/create-comodidades.dto.js';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe.js';

@Controller('comodidades')
export class ComodidadesController {
  constructor(
    private readonly comodidadesService: ComodidadesService,
  ) {}

  @Get()
  findAll() {
    return this.comodidadesService.findAll();
  }

  @Get(':id')
  findById(
    @Param('id', ParseBigIntPipe) id: bigint,
  ) {
    return this.comodidadesService.findById(id);
  }

  @Post()
  create(@Body() data: CreateComodidadeDto) {
    return this.comodidadesService.create(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseBigIntPipe) id: bigint,
  ) {
    await this.comodidadesService.delete(id);
  }
}