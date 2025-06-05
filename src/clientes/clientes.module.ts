import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { AuthModule } from 'auth/auth.module';
import { ClientesController } from './clientes.controller';

@Module({
  providers: [ClientesService]
})
@Module({
  imports: [AuthModule],  // importa otros módulos que usa Clientes (por ej Auth para guards)
  controllers: [ClientesController], // declara el controlador
  providers: [ClientesService],      // declara el servicio
  exports: [ClientesService],        // opcional, si quieres que otros módulos usen el servicio
})
export class ClientesModule {}