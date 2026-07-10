import { MediaType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateExerciseDto {
  @IsUUID()
  typeId: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titleRu?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titleKz?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titleJa?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titleEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  descriptionRu?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  descriptionKz?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  descriptionJa?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  instructionRu?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  instructionKz?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  instructionJa?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  instructionEn?: string;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  difficulty?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
