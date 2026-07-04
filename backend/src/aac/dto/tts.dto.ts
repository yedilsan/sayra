import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const VOICES = [
  'alloy',
  'ash',
  'ballad',
  'coral',
  'echo',
  'sage',
  'shimmer',
  'verse',
  'marin',
  'cedar',
] as const;

export class TtsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  text: string;

  @IsOptional()
  @IsString()
  @IsIn(VOICES)
  voice?: (typeof VOICES)[number];
}
