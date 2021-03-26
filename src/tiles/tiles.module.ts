import { Module } from '@nestjs/common';
import { TilesService } from './tiles.service';
import { TilesController } from './tiles.controller';

@Module({
  controllers: [TilesController],
  providers: [TilesService]
})
export class TilesModule {}
