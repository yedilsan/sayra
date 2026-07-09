import { IsInt, IsString, Min } from 'class-validator';

export class CompleteExerciseDto {
  @IsString()
  childId: string;

  @IsInt()
  @Min(0)
  durationSeconds: number;
}
