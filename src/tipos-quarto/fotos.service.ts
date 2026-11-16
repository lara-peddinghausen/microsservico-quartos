
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { } from 'multer';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class FotosService {
  constructor(private readonly prisma: PrismaService) { }

  async create(idTipoQuarto: bigint, arquivo: Express.Multer.File) {
    // Verificar se o tipo de quarto existe
    const tipoQuarto = await this.prisma.tipo_quarto.findUnique({
      where: { id: idTipoQuarto },
      select: { id: true },
    });

    if (!tipoQuarto) {
      throw new NotFoundException('Tipo de quarto não encontrado');
    }

    // Verificar se o arquivo foi enviado
    if (!arquivo) {
      throw new BadRequestException('É necessário enviar uma imagem');
    }

    // Validar o tamanho máximo de 40 KB
    const tamanhoMaximo = 40 * 1024;

    if (arquivo.size > tamanhoMaximo) {
      throw new BadRequestException(
        'A imagem deve ter no máximo 40 KB',
      );
    }

    // Validar o formato da imagem
    const formatosPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!formatosPermitidos.includes(arquivo.mimetype)) {
      throw new BadRequestException(
        'Formato inválido. Utilize JPEG, PNG ou WebP',
      );
    }

    // Converter a imagem para Base64
    const imagemBase64 = `data:${arquivo.mimetype};base64,${arquivo.buffer.toString('base64')}`;  // Converte o arquivo para Base64

    // Verificar se o conteúdo cabe no campo TEXT do MySQL
    if (Buffer.byteLength(imagemBase64, 'utf8') > 65535) {
      throw new BadRequestException(
        'A imagem excede o tamanho permitido pelo banco de dados',
      );
    }

    // Salvar a imagem no banco
    const foto = await this.prisma.foto.create({
      data: {
        id_tipo_quarto: idTipoQuarto,
        imagem: imagemBase64,
      },
    });

    // Retornar a foto cadastrada
    return {
      id: foto.id.toString(),
      id_tipo_quarto: foto.id_tipo_quarto.toString(),
      imagem: foto.imagem,
    };
  }


  async remove(idTipoQuarto: bigint, idFoto: bigint): Promise<void> {
    // Verificar se o tipo de quarto existe
    const tipoQuarto = await this.prisma.tipo_quarto.findUnique({
      where: { id: idTipoQuarto },
      select: { id: true },
    });

    if (!tipoQuarto) {
      throw new NotFoundException('Tipo de quarto não encontrado');
    }

    // Excluir somente se a foto pertencer ao tipo de quarto informado
    const resultado = await this.prisma.foto.deleteMany({
      where: {
        id: idFoto,
        id_tipo_quarto: idTipoQuarto,
      },
    });

    if (resultado.count === 0) {
      throw new NotFoundException(
        'Foto não encontrada para este tipo de quarto',
      );
    }
  }

  async findImage(idTipoQuarto: bigint, idFoto: bigint) {
    // Verificar se o tipo de quarto existe
    const tipoQuarto = await this.prisma.tipo_quarto.findUnique({
      where: { id: idTipoQuarto },
      select: { id: true },
    });

    if (!tipoQuarto) {
      throw new NotFoundException('Tipo de quarto não encontrado');
    }

    // Buscar a foto associada ao tipo de quarto
    const foto = await this.prisma.foto.findFirst({
      where: {
        id: idFoto,
        id_tipo_quarto: idTipoQuarto,
      },
    });

    if (!foto) {
      throw new NotFoundException(
        'Foto não encontrada para este tipo de quarto',
      );
    }

    // Extrair o formato e o conteúdo Base64
    const resultado = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s.exec(
      foto.imagem,
    );

    if (!resultado) {
      throw new InternalServerErrorException(
        'Formato da imagem armazenada inválido',
      );
    }

    const tipoMime = resultado[1];
    const imagemBase64 = resultado[2];

    // Converter Base64 em dados binários
    const buffer = Buffer.from(imagemBase64, 'base64');

    return {
      buffer,
      tipoMime,
    };
  }


}
