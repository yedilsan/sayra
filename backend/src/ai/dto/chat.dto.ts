import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChatDto {
  @ApiProperty({
    description: 'The user message to send to the AI assistant',
    example: 'How can I help my child practice the "r" sound?',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  message: string;
}
