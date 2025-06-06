import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { AuthModule } from 'auth/auth.module';
import { ClientesController } from './clientes.controller';
import { ClientesRegistroController } from './cliente-registro.controller';

@Module({
  providers: [ClientesService]
})
@Module({
  imports: [AuthModule],  
  controllers: [ClientesController, ClientesRegistroController], 
  providers: [ClientesService],     
  exports: [ClientesService],        
})
export class ClientesModule {}