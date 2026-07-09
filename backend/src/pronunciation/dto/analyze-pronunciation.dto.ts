import { Lang } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class AnalyzePronunciationDto {
  @ApiProperty({ description: 'The child attempting the pronunciation' })
  @IsString()
  childId: string;

  @ApiProperty({ description: 'The word the user is attempting to pronounce', example: 'hello' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  targetWord: string;

  @ApiProperty({ description: 'Target language of the word', enum: Lang, example: Lang.EN })
  @IsEnum(Lang)
  language: Lang;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio recording of the user speaking the target word',
  })
  audio: Express.Multer.File;
}
