import { Module } from '@nestjs/common';
import { CooperativasController } from './cooperativas.controller';
import { CooperativasService } from './cooperativas.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [CooperativasController],
  providers: [CooperativasService],
  exports: [CooperativasService]
})
export class CooperativasModule {}
