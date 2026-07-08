import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EMAIL_QUEUE } from './consts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Versionamento
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //Sagger
  const config = new DocumentBuilder()
    .setTitle('Curso NestJS - Tasks API')
    .setDescription('API desenvolvida durante curso de NestJS - Monaro Dev')
    .setVersion('1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  //Habilitando Micro-serviços
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: EMAIL_QUEUE,
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();

  // Validações
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
