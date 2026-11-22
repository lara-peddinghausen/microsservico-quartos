
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TiposQuartoController } from './tipos-quarto.controller';
import { TiposQuartoService } from './tipos-quarto.service';
import { PrismaService } from '../prisma/prisma.service.js';
import { FotosService } from './fotos.service';
import { ReservasClientService } from '../integracoes/reservas/reservas-client.service.js';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
    }),
  ],
  controllers: [TiposQuartoController],
  providers: [
    TiposQuartoService,
    PrismaService,
    FotosService,
    ReservasClientService,
  ],
})
export class TiposQuartoModule {}
