
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuartosController } from './quartos.controller';
import { QuartosService } from './quartos.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReservasClientService } from '../integracoes/reservas/reservas-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
    }),
  ],
  controllers: [QuartosController],
  providers: [
    QuartosService,
    PrismaService,
    ReservasClientService,
  ],
})
export class QuartosModule {}
