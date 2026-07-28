import { Lang } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description:
      'Initial interface language, chosen before sign-up. Defaults to RU when omitted.',
    enum: Lang,
    example: Lang.EN,
  })
  @IsOptional()
  @IsEnum(Lang)
  language?: Lang;
}
