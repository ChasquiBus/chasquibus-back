import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CooperativasModule } from './cooperativas/cooperativas.module';
import { AdminCooperativasModule } from './admin-cooperativas/admin-cooperativas.module';
import { ClientesController } from './clientes/clientes.controller';
import { ClientesModule } from './clientes/clientes.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CooperativasModule,
    AdminCooperativasModule,
    ClientesModule,
    
  ],
  controllers: [AppController, ClientesController],
  providers: [AppService],
})
export class AppModule {}
