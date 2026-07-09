import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [ChildrenModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
