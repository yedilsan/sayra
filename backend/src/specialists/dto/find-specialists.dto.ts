import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindSpecialistsDto {
  @ApiPropertyOptional({ description: 'Filter by city', example: 'Almaty' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Filter by specialization',
    example: 'Speech therapist',
  })
  @IsOptional()
  @IsString()
  specialization?: string;
}
