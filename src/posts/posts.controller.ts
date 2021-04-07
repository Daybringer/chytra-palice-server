import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    if (!req.user.isAdmin) throw new UnauthorizedException();
    else return this.postsService.create(createPostDto, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      storage: diskStorage({
        destination: './files/images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('upload/:id')
  async uploadDocument(
    @Req() req,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id') id: string,
  ) {
    if (!req.user.isAdmin) {
      this.postsService.removeUnauthorized(images);
      throw new UnauthorizedException();
    } else {
      return await this.postsService.uploadImages(+id, images);
    }
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('images/:filename')
  findOne(@Param('filename') filename: string, @Res() res) {
    return res.sendFile(filename, {
      root: './files/images',
    });
  }

  @Get(':id')
  getPostByID(@Param('id') id: string) {
    return this.postsService.findByID(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() CreatePostDto: CreatePostDto) {
    return this.postsService.update(+id, CreatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
