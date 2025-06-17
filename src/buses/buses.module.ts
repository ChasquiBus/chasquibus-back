import { Module } from '@nestjs/common';
import { BusesController } from './buses.controller';
import { BusesService } from './buses.service';
import { CooperativasModule } from '../cooperativas/cooperativas.module';

@Module({
  imports: [CooperativasModule],
  controllers: [BusesController],
  providers: [BusesService]
})
export class BusesModule {}
