import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { AuthModule } from 'auth/auth.module';
import { ClientesController } from './clientes.controller';

@Module({
  providers: [ClientesService]
})
@Module({
  imports: [AuthModule],  
  controllers: [ClientesController], 
  providers: [ClientesService],     
  exports: [ClientesService],        
})
export class ClientesModule {}