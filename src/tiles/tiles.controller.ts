import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TilesService } from './tiles.service';
import { CreateTileDto } from './dto/create-tile.dto';
import { UpdateTileDto } from './dto/update-tile.dto';

@Controller('tiles')
export class TilesController {
  constructor(private readonly tilesService: TilesService) {}

  @Post()
  create(@Body() createTileDto: CreateTileDto) {
    return this.tilesService.create(createTileDto);
  }

  @Get()
  findAll() {
    return this.tilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTileDto: UpdateTileDto) {
    return this.tilesService.update(+id, updateTileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tilesService.remove(+id);
  }
}
