import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAacCardDto {
  @IsUUID()
  categoryId: string;

  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textRu: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textKz: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textJa: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textEn: string;
}
