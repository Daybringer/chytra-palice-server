import { Injectable } from '@nestjs/common';
import { CreateTileDto } from './dto/create-tile.dto';
import { UpdateTileDto } from './dto/update-tile.dto';

@Injectable()
export class TilesService {
  create(createTileDto: CreateTileDto) {
    return 'This action adds a new tile';
  }

  findAll() {
    return `This action returns all tiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tile`;
  }

  update(id: number, updateTileDto: UpdateTileDto) {
    return `This action updates a #${id} tile`;
  }

  remove(id: number) {
    return `This action removes a #${id} tile`;
  }
}
