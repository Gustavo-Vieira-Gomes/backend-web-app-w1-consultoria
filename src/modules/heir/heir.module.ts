import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { HeirController } from './heir.controller';
import { HeirService } from './heir.service';
import { S3Service } from 'src/services/s3/s3.service';

@Module({
  imports: [ClientModule],
  controllers: [HeirController],
  providers: [HeirService, S3Service],
  exports: [HeirService],
})
export class HeirModule {}
