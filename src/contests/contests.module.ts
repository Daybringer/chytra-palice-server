import { Module } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestEntity } from './entities/contest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContestEntity])],
  controllers: [ContestsController],
  providers: [ContestsService],
})
export class ContestsModule {}
