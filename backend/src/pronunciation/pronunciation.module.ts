import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { PronunciationController } from './pronunciation.controller';
import { PronunciationService } from './pronunciation.service';

@Module({
  imports: [ChildrenModule],
  controllers: [PronunciationController],
  providers: [PronunciationService],
})
export class PronunciationModule {}
