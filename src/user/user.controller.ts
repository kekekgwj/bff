import { Controller, Post, Body, Query, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZjlabService } from 'src/user/zjlab/zjlab.service';

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
    await this.zjlabService.smtpServerConnect();
    return "mail sent"
  }
}