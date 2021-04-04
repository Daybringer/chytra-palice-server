import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { WorkEntity } from './entities/work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordEntity } from './entities/keyword.entity';
import { ContestEntity } from 'src/contests/entities/contest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkEntity, KeywordEntity, ContestEntity]),
  ],
  controllers: [WorksController],
  providers: [WorksService],
})
export class WorksModule {}
