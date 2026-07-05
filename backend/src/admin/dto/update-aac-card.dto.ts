import { PartialType } from '@nestjs/swagger';
import { CreateAacCardDto } from './create-aac-card.dto';

export class UpdateAacCardDto extends PartialType(CreateAacCardDto) {}
