import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ComodidadesService } from './comodidades.service';
import { CreateComodidadeDto } from './dto/create-comodidades.dto';

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
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.comodidadesService.findById(BigInt(id));
  }

  @Post()
  create(
    @Body() data: CreateComodidadeDto,
  ) {
    return this.comodidadesService.create(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.comodidadesService.delete(BigInt(id));
  }
}