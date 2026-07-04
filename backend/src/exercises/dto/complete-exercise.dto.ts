import { IsInt, Min } from 'class-validator';

export class CompleteExerciseDto {
  @IsInt()
  @Min(0)
  durationSeconds: number;
}
