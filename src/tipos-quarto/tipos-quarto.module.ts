import { Module } from '@nestjs/common';
import { TiposQuartoController } from './tipos-quarto.controller';
import { TiposQuartoService } from './tipos-quarto.service';
import { PrismaService } from '../prisma/prisma.service.js';
import { FotosService } from './fotos.service';
import { QuartosModule } from '../quartos/quartos.module';

@Module({
  imports: [QuartosModule],
  controllers: [TiposQuartoController],
  providers: [
    TiposQuartoService,
    PrismaService,
    FotosService,
  ],
})
export class TiposQuartoModule {}