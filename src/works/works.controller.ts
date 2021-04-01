import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { identity } from 'rxjs';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWorkDto: CreateWorkDto, @Req() req) {
    // assign user info if user isn't an admin
    if (!req.user.isAdmin) {
      return this.worksService.create(
        this.worksService.inferUserInfoFromJWT(createWorkDto, req.user),
      );
    }

    return this.worksService.create(createWorkDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/documents',
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
  uploadDocument(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.worksService.uploadDocument(file, +id);
  }

  @Get('file/:id/:filetype')
  sendFile(@Res() res, @Param('id') id, @Param('filetype') filetype) {
    return res.sendFile(`${id}.${filetype}`, {
      root: `./files/documents/${id}`,
    });
  }

  @Get()
  findAll() {
    return this.worksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto) {
    return this.worksService.update(+id, updateWorkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worksService.remove(+id);
  }
}
