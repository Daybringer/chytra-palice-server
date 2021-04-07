import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Repository } from 'typeorm';
import { TileEntity } from './entities/tile.entity';

@Controller('tiles')
export class TilesController {
  constructor(
    @InjectRepository(TileEntity)
    private readonly tilesRepository: Repository<TileEntity>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('spotify')
  async updateSpotify(@Body() body: { episode: string }, @Req() req) {
    if (!req.user.isAdmin) throw new UnauthorizedException('Not an admin');
    const exists = await this.tilesRepository.findOne({
      where: { type: 'spotify' },
    });
    if (exists) {
      return await this.tilesRepository.update(
        { type: 'spotify' },
        { content: body.episode },
      );
    } else {
      const newTile = new TileEntity();
      newTile.type = 'spotify';
      newTile.content = body.episode;
      return await this.tilesRepository.save(newTile);
    }
  }

  @Get('spotify')
  async getEpisode() {
    return (await this.tilesRepository.findOne({ where: { type: 'spotify' } }))
      .content;
  }

  @Get('aktualita')
  async getText() {
    return (
      await this.tilesRepository.findOne({ where: { type: 'aktualita' } })
    ).content;
  }

  @UseGuards(JwtAuthGuard)
  @Post('aktualita')
  async updateAktualita(@Body() body: { text: string }, @Req() req) {
    if (!req.user.isAdmin) throw new UnauthorizedException('Not an admin');

    const exists = await this.tilesRepository.findOne({
      where: { type: 'aktualita' },
    });
    if (exists) {
      return await this.tilesRepository.update(
        { type: 'aktualita' },
        { content: body.text },
      );
    } else {
      const newTile = new TileEntity();
      newTile.type = 'aktualita';
      newTile.content = body.text;
      return await this.tilesRepository.save(newTile);
    }
  }
}
