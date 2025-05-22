import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssetModule } from './modules/asset/asset.module';
import { LiabilityModule } from './modules/liability/liability.module';
import { HeirModule } from './modules/heir/heir.module';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ClientModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), AssetModule, LiabilityModule, HeirModule, UserModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
