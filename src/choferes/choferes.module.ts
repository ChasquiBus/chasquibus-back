import { Module } from '@nestjs/common';
import { ChoferesService } from './choferes.service';
import { ChoferesController } from './choferes.controller';

@Module({
  controllers: [ChoferesController],
  providers: [ChoferesService],
})
export class ChoferesModule {}
