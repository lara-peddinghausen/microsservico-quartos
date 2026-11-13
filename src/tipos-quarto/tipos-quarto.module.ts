import { Module } from '@nestjs/common';
import { TiposQuartoController } from './tipos-quarto.controller';
import { TiposQuartoService } from './tipos-quarto.service';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [TiposQuartoController],
  providers: [TiposQuartoService, PrismaService]
})
export class TiposQuartoModule {}
