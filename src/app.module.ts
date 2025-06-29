import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CooperativasModule } from './cooperativas/cooperativas.module';
import { AdminCooperativasModule } from './admin-cooperativas/admin-cooperativas.module';

import { ConfiguracionAsientosModule } from './configuracion-asientos/configuracion-asientos.module';

import { ClientesModule } from './clientes/clientes.module';
import { BusesModule } from './buses/buses.module';
import { ChoferesModule } from './choferes/choferes.module';
import { UsuariosModule } from 'usuarios/usuario.module';
import { CiudadesModule } from './ciudades_provincias/ciudades.module';
import { ParadasModule } from './paradas/paradas.module';
import { RutasModule } from './rutas/rutas.module';
import { RutaParadaModule } from 'ruta-parada/ruta-parada.module';
import { TarifasParadasModule } from './tarifas-paradas/tarifas-paradas.module';
import { FrecuenciasModule } from './frecuencias/frecuencias.module';
import { HojaTrabajoModule } from './hoja-trabajo/hoja-trabajo.module';
import { VentasModule } from './ventas/ventas.module';
import { BoletosModule } from './boletos/boletos.module';
import { DescuentosModule } from './descuentos/descuentos.module';
import { HojaTrabajoService } from './hoja-trabajo/hoja-trabajo.service';
import { PagosModule } from './pagos/pagos.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';


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
    CiudadesModule,
    ParadasModule,
    RutasModule,
    RutaParadaModule,
    TarifasParadasModule,
    FrecuenciasModule,
    HojaTrabajoModule,
    VentasModule,
    BoletosModule,
    DescuentosModule,
    PagosModule,
    MetodosPagoModule,
  ],
  controllers: [AppController],
  providers: [AppService, HojaTrabajoService],
})
export class AppModule {}
