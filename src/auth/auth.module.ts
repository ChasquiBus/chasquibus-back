import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from 'drizzle/drizzle.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ChoferesModule } from 'choferes/choferes.module';
import { AdminCooperativasModule } from 'admin-cooperativas/admin-cooperativas.module';
import { ClientesModule } from 'clientes/clientes.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
    ConfigModule,
    DrizzleModule,
    ChoferesModule, AdminCooperativasModule, ClientesModule
  ],
  exports: [AuthService],
})
export class AuthModule {}
