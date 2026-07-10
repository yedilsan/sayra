import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAacCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  imageUrl: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameRu?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameKz?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameJa?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameEn?: string;
}
