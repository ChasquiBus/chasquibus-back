import { Module } from '@nestjs/common';
import { AdminCooperativasService } from './admin-cooperativas.service';
import { AdminCooperativasController } from './admin-cooperativas.controller';
import { UsuariosModule } from 'usuarios/usuario.module';
import { CooperativasModule } from 'cooperativas/cooperativas.module';

@Module({
  providers: [AdminCooperativasService],
  controllers: [AdminCooperativasController],
  imports: [UsuariosModule, CooperativasModule ],
  exports:[AdminCooperativasService]
})
export class AdminCooperativasModule {}
