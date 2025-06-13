import { forwardRef, Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { UsuariosModule } from 'usuarios/usuario.module';

@Module({
  imports: [ UsuariosModule],  
  controllers: [ClientesController], 
  providers: [ClientesService],     
  exports: [ClientesService],        
})
export class ClientesModule {}