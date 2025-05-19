import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { ClientModule } from 'src/client/client.module';

@Module({
  providers: [AssetService],
  controllers: [AssetController],
  imports: [ClientModule],
})
export class AssetModule {}
