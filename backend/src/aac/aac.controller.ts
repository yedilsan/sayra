import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AacService } from './aac.service';
import { TtsDto } from './dto/tts.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('aac')
export class AacController {
  constructor(private readonly aacService: AacService) {}

  @Get('categories')
  categories() {
    return this.aacService.findCategories();
  }

  @Get('categories/:id/cards')
  cards(@Param('id') id: string) {
    return this.aacService.findCards(id);
  }

  @Get('core-cards')
  coreCards() {
    return this.aacService.findCoreCards();
  }

  @Post('tts')
  async tts(@Body() dto: TtsDto, @Res() res: Response) {
    const audioStream = await this.aacService.synthesizeSpeech(
      dto.text,
      dto.voice ?? 'alloy',
    );
    res.setHeader('Content-Type', 'audio/mpeg');
    audioStream.pipe(res);
  }
}
