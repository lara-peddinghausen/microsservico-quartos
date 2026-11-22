import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface RespostaBloqueioInativacao {
  quartoId: string;
  possuiReservasBloqueantes: boolean;
}

@Injectable()
export class ReservasClientService {
  constructor(private readonly httpService: HttpService) { }

  async possuiReservasBloqueantes(quartoId: bigint): Promise<boolean> {
    const urlBase = process.env.RESERVAS_SERVICE_URL;
    const chave = process.env.INTERNAL_API_KEY;

    if (!urlBase || !chave) {
      throw new ServiceUnavailableException(
        'Integração com Reservas não configurada.',
      );
    }

    try {
      const resposta = await firstValueFrom(
        this.httpService.get<RespostaBloqueioInativacao>(
          `${urlBase.replace(/\/$/, '')}/reservas/quartos/${quartoId.toString()}/bloqueio-inativacao`,
          {
            headers: {
              'x-internal-api-key': chave,
            },
          },
        ),
      );

      if (typeof resposta.data?.possuiReservasBloqueantes !== 'boolean') {
        throw new ServiceUnavailableException(
          'Resposta inválida do microsserviço de Reservas.',
        );
      }

      return resposta.data.possuiReservasBloqueantes;
    } catch (erro) {
      if (erro instanceof ServiceUnavailableException) {
        throw erro;
      }

      if (erro instanceof AxiosError) {
        throw new ServiceUnavailableException(
          'Não foi possível consultar o microsserviço de Reservas.',
        );
      }

      throw new ServiceUnavailableException(
        'Erro ao verificar reservas do quarto.',
      );
    }
  }


  async consultarQuartosIndisponiveis(
    quartoIds: bigint[],
    checkin: string,
    checkout: string,
  ): Promise<string[]> {
    const urlBase = process.env.RESERVAS_SERVICE_URL;
    const chave = process.env.INTERNAL_API_KEY;

    if (!urlBase || !chave) {
      throw new ServiceUnavailableException(
        'Integração com Reservas não configurada.',
      );
    }

    try {
      const resposta = await firstValueFrom(
        this.httpService.post<{
          quartosIndisponiveis: string[];
        }>(
          `${urlBase.replace(/\/$/, '')}/reservas/disponibilidade/consultar`,
          {
            quartoIds: quartoIds.map((id) => id.toString()),
            checkin,
            checkout,
          },
          {
            headers: {
              'x-internal-api-key': chave,
            },
          },
        ),
      );

      if (
        !Array.isArray(resposta.data?.quartosIndisponiveis) ||
        !resposta.data.quartosIndisponiveis.every(
          (id) => typeof id === 'string' && /^\d+$/.test(id),
        )
      ) {
        throw new ServiceUnavailableException(
          'Resposta inválida do microsserviço de Reservas.',
        );
      }

      return resposta.data.quartosIndisponiveis;
    } catch (erro) {
      if (erro instanceof ServiceUnavailableException) {
        throw erro;
      }

      throw new ServiceUnavailableException(
        'Não foi possível consultar a disponibilidade em Reservas.',
      );
    }
  }

}
