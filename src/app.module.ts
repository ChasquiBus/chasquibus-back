import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CooperativasModule } from './cooperativas/cooperativas.module';
import { AdminCooperativasModule } from './admin-cooperativas/admin-cooperativas.module';
import { ConfiguracionAsientosModule } from './configuracion-asientos/configuracion-asientos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CooperativasModule,
    AdminCooperativasModule,
    ConfiguracionAsientosModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
