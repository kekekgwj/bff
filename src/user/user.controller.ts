import { Controller, Post, Body, Query, Get, Version, VERSION_NEUTRAL, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZjlabService } from 'src/user/zjlab/zjlab.service';
import { UserActivate, UserRegister } from './user.dto';
import { User } from './entities/user.entity';
import { Public } from '../auth/constants';

@ApiTags('用户')
@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL]
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly zjlabService: ZjlabService,
  ) { 
  }
  @ApiOperation({summary: 'SMTP 连接测试'})
  @Get('/smtp')
  async connect() {
    await this.zjlabService.smtpServerRegister('1234', 'guo.weijie@zhejianglab.com');
    return "mail sent"
  }

  @ApiTags('激活')
  @Public()
  @Get('/activate')
  async activate(
    @Query() query: UserActivate,
  ) {
    const { username, code } = query;
    const verifyCode = await this.userService.getRedisByUsername(username);
    if (verifyCode === code) {
      await this.userService.activateAccount(username);
      return '激活成功';
    } else {
      throw '激活失败';
    }
  }
}

