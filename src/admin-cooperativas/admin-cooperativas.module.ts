import { Module } from '@nestjs/common';
import { AdminCooperativasService } from './admin-cooperativas.service';
import { AdminCooperativasController } from './admin-cooperativas.controller';

@Module({
  providers: [AdminCooperativasService],
  controllers: [AdminCooperativasController]
})
export class AdminCooperativasModule {}
