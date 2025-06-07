import { Module } from '@nestjs/common';
import { ChoferesService } from './choferes.service';
import { ChoferesController } from './choferes.controller';
import { UsuariosModule } from 'usuarios/usuario.module';

@Module({
  controllers: [ChoferesController],
  providers: [ChoferesService],
  imports: [UsuariosModule]
})
export class ChoferesModule {}
