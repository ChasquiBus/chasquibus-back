import { Module } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { ParadasController } from './paradas.controller';

@Module({
  controllers: [ParadasController],
  providers: [ParadasService],
})
export class ParadasModule {}
