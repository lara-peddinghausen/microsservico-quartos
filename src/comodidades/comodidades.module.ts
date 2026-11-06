import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ComodidadesController } from './comodidades.controller.js';
import { ComodidadesService } from './comodidades.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ComodidadesController],
  providers: [ComodidadesService],
})
export class ComodidadesModule {}