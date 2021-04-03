import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, req.user.name);
  }

  @Get(':id')
  findByPostID(@Param('id') id: string) {
    return this.commentsService.findAllByPostID(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.isAdmin) return this.commentsService.removeByID(+id);
    else throw new UnauthorizedException('Not an admin');
  }
}
