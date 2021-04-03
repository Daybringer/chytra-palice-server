import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// DTOs
import { CreateCommentDto } from './dto/create-comment.dto';
// Entities & interfaces
import { CommentEntity } from './entities/comment.entity';
import { Comment } from './entities/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}
  create(
    createCommentDto: CreateCommentDto,
    authorName: string,
  ): Promise<Comment> {
    const newComment = new CommentEntity();
    newComment.dateAdded = Date.now();
    newComment.authorName = authorName;
    newComment.workID = createCommentDto.workID;
    newComment.message = createCommentDto.message;
    return this.commentRepository.save(newComment);
  }

  findAllByPostID(workID: number) {
    return this.commentRepository.find({
      where: { workID },
      order: { dateAdded: 'ASC' },
    });
  }

  removeByID(id: number) {
    return this.commentRepository.delete({ id });
  }
}
