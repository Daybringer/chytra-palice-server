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
  HttpCode,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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

  @Get(':id/:filetype')
  sendFile(@Res() res, @Param('id') id, @Param('filetype') filetype) {
    return res.sendFile(`${id}.${filetype}`, {
      root: `./files/documents/${id}`,
    });
  }

  @Get()
  findAll(@Query() filterOptions) {
    console.log(filterOptions);
    return this.worksService.findAll(filterOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worksService.findOneByID(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('approve/:id')
  approveWork(@Param('id') id: string, @Req() req) {
    if (req.user.isAdmin) return this.worksService.approveWork(+id);
    else throw new UnauthorizedException('No admin priviliges');
  }

  @UseGuards(JwtAuthGuard)
  @Post('reject/:id')
  rejectWork(@Param('id') id: string, @Req() req, @Body() body) {
    console.log(body);
    if (req.user.isAdmin)
      return this.worksService.rejectWork(
        +id,
        req.user.email,
        body.guarantorMessage,
      );
    else throw new UnauthorizedException('No admin priviliges');
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto) {
  //   return this.worksService.update(+id, updateWorkDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.worksService.remove(+id);
  // }
}
