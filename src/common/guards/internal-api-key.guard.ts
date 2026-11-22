
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const chaveEsperada = this.config.get<string>('INTERNAL_API_KEY');

    if (!chaveEsperada) {
      throw new ServiceUnavailableException(
        'A chave de autenticação interna não foi configurada.',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const chaveRecebida = request.header('x-internal-api-key');

    if (!chaveRecebida) {
      throw new UnauthorizedException(
        'Chave de autenticação interna não informada.',
      );
    }

    const esperada = Buffer.from(chaveEsperada);
    const recebida = Buffer.from(chaveRecebida);

    if (
      esperada.length !== recebida.length ||
      !timingSafeEqual(esperada, recebida)
    ) {
      throw new UnauthorizedException(
        'Chave de autenticação interna inválida.',
      );
    }

    return true;
  }
}