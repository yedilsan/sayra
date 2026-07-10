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

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textRu?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textKz?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textJa?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  textEn?: string;
}
