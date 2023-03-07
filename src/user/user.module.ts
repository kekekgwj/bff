import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/common/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.providers';
import { FeishuController } from './feishu/feishu.controller';
import { FeishuService } from './feishu/feishu.service';
import { ZjlabService } from './zjlab/zjlab.service';
@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [
    FeishuController,
    UserController
  ],
  providers: [...UserProviders, UserService, FeishuService, ZjlabService],
  exports: [UserService, FeishuService, ZjlabService],
})
export class UserModule { }