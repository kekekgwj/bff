import { Controller, Post, Body, Query, Get, Version, VERSION_NEUTRAL, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZjlabService } from 'src/user/zjlab/zjlab.service';
import { UserActivate, UserRegister } from './user.dto';
import { User } from './entities/user.entity';

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
    await this.zjlabService.smtpServerConnect('1234', 'guo.weijie@zhejianglab.com');
    return "mail sent"
  }
  @ApiTags('注册')
  @Post('/register')
  async register(
    @Body() body: UserRegister
  ) {
    const registerInfo: Omit<User, 'id'> = {
      username: body.username,
      password: body.password,
      email: body.email,
      active: false,
      company: body.company,
      companyType: body.companyType,
    };
    try {
      const verifyCode = this.userService.generateVerificationCode();
      await this.userService.registerUser(registerInfo);
      await this.zjlabService.smtpServerConnect(verifyCode, body.email);
      await this.userService.storeRedisByUsername(verifyCode, body.username);
      return '注册成功，等待激活';
    } catch (e) {
      return e.toString();
    }
  }
  @ApiTags('激活')
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

