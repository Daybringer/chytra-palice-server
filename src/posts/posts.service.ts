import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as gm from 'gm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
  async create(createPostDto: CreatePostDto, author: string) {
    const newPost = new PostEntity();
    newPost.title = createPostDto.title;
    newPost.author = author;
    newPost.dateAdded = Date.now();
    newPost.content = createPostDto.content;
    return await this.postRepository.save(newPost);
  }

  async uploadImages(id: number, images: Express.Multer.File[]) {
    // Removing old images
    const post = await this.postRepository.findOne({ id });
    post.pictures.forEach((pictureName) => {
      fs.rmSync(`/files/images/${pictureName}.png`, {
        force: true,
        recursive: true,
      });
    });

    images.forEach((image) => {
      gm(image.path)
        .resize(null, 1000)
        .write(image.path, () => {});
    });
    const imagesNames = images.map((image) => image.filename);
    await this.postRepository.update({ id }, { pictures: imagesNames });
    return;
  }

  removeUnauthorized(files: Express.Multer.File[]) {
    files.forEach((file) => {
      fs.rmSync(file.path);
    });
    return;
  }

  async findAll() {
    return await this.postRepository.find({
      where: { deleted: false },
      order: { id: 'DESC' },
    });
  }

  async findByID(id: number) {
    return await this.postRepository.findOne({ id, deleted: false });
  }

  async update(id: number, createPostDto: CreatePostDto) {
    return await this.postRepository.update({ id }, createPostDto);
  }

  async remove(id: number) {
    return await this.postRepository.update({ id }, { deleted: true });
  }
}
