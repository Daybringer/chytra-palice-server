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
} from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWorkDto: CreateWorkDto, @Req() req) {
    return this.worksService.create(createWorkDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('document', {
      dest: 'files',
      fileFilter: (req, file, cb) => {
        console.log(req);
        if (!file.originalname.match(/\.(pdf|odt|doc|docx)$/))
          cb(new Error('Not supported format'), false);

        file.filename = String(Date.now());
        cb(null, true);
      },
    }),
  )
  @Post('upload/:id')
  uploadDocument(@Req() req, @UploadedFile() file) {}

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
