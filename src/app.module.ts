import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorksModule } from './works/works.module';
import { TilesModule } from './tiles/tiles.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ContestsModule } from './contests/contests.module';

@Module({
  imports: [WorksModule, TilesModule, PostsModule, CommentsModule, ContestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
