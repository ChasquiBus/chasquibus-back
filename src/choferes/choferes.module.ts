import { Module } from '@nestjs/common';
import { ChoferesService } from './choferes.service';
import { ChoferesController } from './choferes.controller';
import { UsuariosModule } from 'usuarios/usuario.module';
import { CooperativasModule } from 'cooperativas/cooperativas.module';
import { AdminCooperativasModule } from 'admin-cooperativas/admin-cooperativas.module';

@Module({
  controllers: [ChoferesController],
  providers: [ChoferesService],
  imports: [UsuariosModule, CooperativasModule, AdminCooperativasModule],
  exports: [ChoferesService]
})
export class ChoferesModule {}
