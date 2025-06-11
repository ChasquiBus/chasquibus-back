import { Module } from '@nestjs/common';
import { CooperativasController } from './cooperativas.controller';
import { CooperativasService } from './cooperativas.service';

@Module({
  controllers: [CooperativasController],
  providers: [CooperativasService],
  exports: [CooperativasService]
})
export class CooperativasModule {}
