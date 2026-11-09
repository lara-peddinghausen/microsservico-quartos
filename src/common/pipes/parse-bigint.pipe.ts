import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    if (!/^[1-9]\d*$/.test(value)) {
      throw new BadRequestException(
        'O ID deve ser um número inteiro positivo',
      );
    }

    const id = BigInt(value);

    if (id > 9223372036854775807n) {
      throw new BadRequestException(
        'O ID excede o limite permitido',
      );
    }

    return id;
  }
}