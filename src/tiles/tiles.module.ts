import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from './entities/tile.entity';
import { TilesController } from './tiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity])],
  controllers: [TilesController],
})
export class TilesModule {}
