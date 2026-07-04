import { Module } from '@nestjs/common';
import { AacController } from './aac.controller';
import { AacService } from './aac.service';

@Module({
  controllers: [AacController],
  providers: [AacService],
})
export class AacModule {}
