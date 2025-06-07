import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { AuthModule } from 'auth/auth.module';
import { ClientesController } from './clientes.controller';
import { ClientesRegistroController } from './cliente-registro.controller';
import { UsuariosModule } from 'usuarios/usuario.module';

@Module({
  imports: [AuthModule, UsuariosModule],  
  controllers: [ClientesController, ClientesRegistroController], 
  providers: [ClientesService],     
  exports: [ClientesService],        
})
export class ClientesModule {}