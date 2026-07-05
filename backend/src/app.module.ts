import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AacModule } from './aac/aac.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProgressModule } from './progress/progress.module';
import { PronunciationModule } from './pronunciation/pronunciation.module';
import { SpecialistsModule } from './specialists/specialists.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AacModule,
    ExercisesModule,
    PronunciationModule,
    AiModule,
    SpecialistsModule,
    ProgressModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
