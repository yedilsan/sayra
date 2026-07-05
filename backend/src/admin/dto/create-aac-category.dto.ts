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
  @MaxLength(50)
  icon: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameRu: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameKz: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameJa: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameEn: string;
}
