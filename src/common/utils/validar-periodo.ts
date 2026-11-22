import { BadRequestException } from '@nestjs/common';

export function validarPeriodo(
  checkin: string,
  checkout: string,
): void {
  const dataValida = (valor: string): boolean => {
    if (
      typeof valor !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(valor)
    ) {
      return false;
    }

    const data = new Date(`${valor}T00:00:00Z`);

    return (
      !Number.isNaN(data.getTime()) &&
      data.toISOString().slice(0, 10) === valor
    );
  };

  if (
    !dataValida(checkin) ||
    !dataValida(checkout) ||
    checkout <= checkin
  ) {
    throw new BadRequestException(
      'Informe datas válidas, com checkout posterior ao checkin.',
    );
  }
}