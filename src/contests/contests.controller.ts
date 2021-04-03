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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';

@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContestDto: CreateContestDto, @Req() req) {
    if (!req.user.isAdmin) throw new UnauthorizedException();
    return this.contestsService.create(createContestDto);
  }

  @Get()
  findAll() {
    return this.contestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contestsService.findOneByID(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContestDto: UpdateContestDto) {
    return this.contestsService.update(+id, updateContestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contestsService.remove(+id);
  }
}
