import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AnalyzePronunciationDto } from './dto/analyze-pronunciation.dto';
import { PronunciationService } from './pronunciation.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pronunciation')
export class PronunciationController {
  constructor(private readonly pronunciationService: PronunciationService) {}

  @Post('analyze')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  analyze(
    @UploadedFile() audio: Express.Multer.File,
    @Body() dto: AnalyzePronunciationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!audio) {
      throw new BadRequestException('Audio file is required');
    }

    return this.pronunciationService.analyze(user.userId, audio, dto);
  }
}
