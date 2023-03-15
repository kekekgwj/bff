import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/common/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ZjlabService } from './zjlab/zjlab.service';
import { User } from './user.mongo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [
    UserController
  ],
  providers: [UserService, ZjlabService],
  exports: [UserService, ZjlabService],
})
export class UserModule { }