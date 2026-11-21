import { Module } from '@nestjs/common';
import { QuartosController } from './quartos.controller';
import { QuartosService } from './quartos.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuartosController],
  providers: [QuartosService, PrismaService]
})
export class QuartosModule {}
