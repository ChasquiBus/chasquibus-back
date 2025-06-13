import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
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
    .addTag('cliente-registro', "Registro de Cliente")
    .addTag('clientes', "Modulo de gestion de clientes")
    .addTag('ciudades', "Modulo de gestion de ciudades")
    .addTag('paradas', "Modulo de gestion de paradas")
    .addTag('configuracion-asientos', "Modulo de gestion de configuración de asientos")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
