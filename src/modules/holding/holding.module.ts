import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { HoldingController } from './holding.controller';
import { HoldingService } from './holding.service';

@Module({
  imports: [ClientModule],
  controllers: [HoldingController],
  providers: [HoldingService],
  exports: [HoldingService],
})
export class HoldingModule {}
