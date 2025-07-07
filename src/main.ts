import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // opcional: elimina propiedades desconocidas
      forbidNonWhitelisted: true, // opcional: lanza error si mandan propiedades no permitidas
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'https://chasquibus-d4sa4hpa2-paul-villacis-projects.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Servir archivos estáticos de la carpeta 'upload' desde la raíz del proyecto
  app.useStaticAssets(join(process.cwd(), 'upload'), {
    prefix: '/upload/',
  });

  const config = new DocumentBuilder()
    .setTitle('Documentacion Backend de ChasquiBus')
    .setDescription('La documentación de la API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'access-token',
    )
    .addTag('auth', 'Modulo de Autenticacion')
    .addTag('cooperativas', 'Modulo de Gestion de cooperativas')
    .addTag('admin-cooperativas', 'Modulo de Gestion de Admins Cooperativos')
    .addTag('choferes', "Modulo de gestion de choferes")
    .addTag('clientes', "Modulo de gestion de clientes")
    .addTag('ciudades', "Consultar ciudades")
    .addTag('provincias', "Consultar provincias")
    .addTag('paradas', "Modulo de gestion de paradas")
    .addTag('configuracion-asientos', "Modulo de gestion de configuración de asientos")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3001,'0.0.0.0');
}
bootstrap();