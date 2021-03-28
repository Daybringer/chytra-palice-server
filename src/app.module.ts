import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorksModule } from './works/works.module';
import { TilesModule } from './tiles/tiles.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ContestsModule } from './contests/contests.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: 'palice',
      synchronize: true,
      autoLoadEntities: true,
    }),
    MulterModule.register({
      dest: './files',
    }),
    WorksModule,
    TilesModule,
    PostsModule,
    CommentsModule,
    ContestsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
