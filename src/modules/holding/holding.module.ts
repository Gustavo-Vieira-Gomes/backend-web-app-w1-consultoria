import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { HoldingController } from './heir.controller';
import { HoldingService } from './heir.service';

@Module({
  imports: [ClientModule],
  controllers: [HoldingController],
  providers: [HoldingService],
  exports: [HoldingService],
})
export class HoldingModule {}
