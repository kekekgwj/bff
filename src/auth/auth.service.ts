import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { FeishuUserInfo } from 'src/user/feishu/feishu.dto';
import { FeishuService } from 'src/user/feishu/feishu.service';
import { ZjlabService } from 'src/user/zjlab/zjlab.service';
import { User } from '@/user/user.mongo.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private zjlabService: ZjlabService,
    private userService: UserService,
    private feishuService: FeishuService,
  ) { }

  // 验证飞书用户 
  async validateFeishuUser(code: string): Promise<Payload> {
    const feishuInfo: FeishuUserInfo = await this.getFeishuTokenByApplications(
      code,
    );

    // 将飞书的用户信息同步到数据库
    const user: User = await this.userService.createOrUpdateByFeishu(
      feishuInfo,
    );

    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      feishuAccessToken: feishuInfo.accessToken,
      feishuUserId: feishuInfo.feishuUserId,
    };
  }
  // 获取飞书用户信息
  async getFeishuTokenByApplications(code: string) {
    const data = await this.feishuService.getUserToken(code);
    const feishuInfo: FeishuUserInfo = {
      accessToken: data.access_token,
      avatarBig: data.avatar_big,
      avatarMiddle: data.avatar_middle,
      avatarThumb: data.avatar_thumb,
      avatarUrl: data.avatar_url,
      email: data.email,
      enName: data.en_name,
      mobile: data.mobile,
      name: data.name,
      feishuUnionId: data.union_id,
      feishuUserId: data.user_id,
    };
    return feishuInfo;
  }
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