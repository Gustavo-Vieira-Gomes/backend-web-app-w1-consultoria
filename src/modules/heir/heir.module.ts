import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { HeirController } from './heir.controller';
import { HeirService } from './heir.service';

@Module({
  imports: [ClientModule],
  controllers: [HeirController],
  providers: [HeirService],
  exports: [HeirService],
})
export class HeirModule {}
