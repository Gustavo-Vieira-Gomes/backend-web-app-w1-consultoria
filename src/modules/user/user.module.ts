import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientModule } from 'src/client/client.module';
import { S3Service } from 'src/services/s3/s3.service';

@Module({
  imports: [ClientModule],
  providers: [UserService, S3Service],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
