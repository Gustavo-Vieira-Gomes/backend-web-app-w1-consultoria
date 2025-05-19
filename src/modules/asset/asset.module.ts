import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { ClientModule } from 'src/client/client.module';
import { S3Service } from 'src/services/s3/s3.service';

@Module({
  providers: [AssetService, S3Service],
  controllers: [AssetController],
  imports: [ClientModule],
})
export class AssetModule {}
