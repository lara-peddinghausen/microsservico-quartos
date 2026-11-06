import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Configura a validação global dos dados recebidos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configura a documentação Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API - Catálogo de Quartos')
    .setDescription(
      'API responsável pelo gerenciamento de quartos, tipos de quarto e comodidades.',
    )
    .setVersion('1.0')
    .build();

  const documento = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documento);

  // Obtém a porta configurada nas variáveis de ambiente
  const config = app.get(ConfigService);
  const porta = config.get<number>('PORT', 3000);

  await app.listen(porta);

  Logger.log(
    `API no ar em http://localhost:${porta}`,
    'Bootstrap',
  );
}

void bootstrap();