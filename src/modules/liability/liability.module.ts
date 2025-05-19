import { Module } from '@nestjs/common';
import { LiabilityService } from './liability.service';
import { LiabilityController } from './liability.controller';

@Module({
  providers: [LiabilityService],
  controllers: [LiabilityController]
})
export class LiabilityModule {}
