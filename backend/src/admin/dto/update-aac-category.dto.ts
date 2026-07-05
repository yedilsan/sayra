import { PartialType } from '@nestjs/swagger';
import { CreateAacCategoryDto } from './create-aac-category.dto';

export class UpdateAacCategoryDto extends PartialType(CreateAacCategoryDto) {}
