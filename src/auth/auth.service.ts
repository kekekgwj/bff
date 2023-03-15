import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { ZjlabService } from 'src/user/zjlab/zjlab.service';
// import { User } from '@/user/user.mongo.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private zjlabService: ZjlabService,
    private userService: UserService,
  ) { }

  // jwt 登录
  async login(user: Payload) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  // 验证zjlab用户
  async validateZJlabUser(ticket: string): Promise<any> {
    const zjlabInfo = await this.zjlabService.getUserInfo(ticket);

    return zjlabInfo
  }

  // 获取zjlab信息
  // async getZjlabInfoByTicket(ticket: string) {
  //   const data = await this.zjlabService.getUserInfo(ticket);
  //   return data;

  // }


}