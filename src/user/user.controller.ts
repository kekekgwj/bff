import { Controller, Post, Body, Query, Get, Version, VERSION_NEUTRAL, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZjlabService } from 'src/user/zjlab/zjlab.service';
import { UserActivate, UserRegister } from './user.dto';
import { User } from './entities/user.entity';
import { Public } from '../auth/constants';
import { RealIP } from 'nestjs-real-ip';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('用户')
@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL]
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly zjlabService: ZjlabService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    const registerInfoStr = await this.userService.getRegisterInfoByVerifyCode(code);
    const registerInfo: Omit<User, 'id'> = JSON.parse(registerInfoStr)
    if (registerInfo.username === username) {
      await this.usersRepository.save({ ...registerInfo, active: true });
      // await this.userService.activateAccount(username);
      return '激活成功';
    } else {
      throw '激活失败';
    }
  }
  @ApiTags('获取ip')
  @Public()
  @Get('/ip')
  getRealIP (@RealIP() ip: string): string {
    return ip;
  }
}

