import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CooperativasModule } from './cooperativas/cooperativas.module';
import { AdminCooperativasModule } from './admin-cooperativas/admin-cooperativas.module';

import { ConfiguracionAsientosModule } from './configuracion-asientos/configuracion-asientos.module';

import { ClientesController } from './clientes/clientes.controller';
import { ClientesModule } from './clientes/clientes.module';
import { BusesModule } from './buses/buses.module';
import { ChoferesModule } from './choferes/choferes.module';
import { UsuariosModule } from 'usuarios/usuario.module';
import { ResolucionesModule } from './resoluciones/resoluciones.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsuariosModule,
    CooperativasModule,
    AdminCooperativasModule,
    ConfiguracionAsientosModule,
    ClientesModule,
    BusesModule,
    ChoferesModule,
    ResolucionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
