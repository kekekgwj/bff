import {
  Controller,
  UseGuards,
  Res,
  Get,
  Query,
  VERSION_NEUTRAL,
  Header,
  Req,
} from '@nestjs/common';
import { ZjlabAuthGuard } from './guards/zjlab-auth.guard'
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetZjLabUserInfo } from './auth.dto';
import { Public } from './constants';
import { PayloadUser } from '@/helper';
import { FastifyReply } from 'fastify'

@ApiTags('用户认证')
@Controller({
  path: 'auth',
  version: [VERSION_NEUTRAL]
})
export class AuthController {
  constructor(
    private authService: AuthService,
    
  ) { }


  @ApiOperation({
    summary: '解析 token',
    description: '解析 token 信息',
  })

  @Get('/token/info')
  async getTokenInfo(@PayloadUser() user: Payload) { 
    return user;
  }


  @ApiOperation({
    summary: 'ZJLAB SSO登陆',
    description: 'https://onekey-test.zhejianglab.com/maxkey/authz/cas/687f9918-23fa-4188-a150-f826e99b57ab?service=http%3A%2F%2Flocalhost%3A3005%2F'
  })
  @UseGuards(ZjlabAuthGuard)
  @Public()
  @Get('/zjlab/auth') 
  @Header('access-control-expose-headers', 'Set-Cookie')
  async getZJLabToken(
    @PayloadUser() user: Payload,
    @Res({ passthrough: true }) response: FastifyReply,
    @Query() query: GetZjLabUserInfo,
    ) {
    // zjlabAuthguard 的validate把user挂载ctx.request -> @payloaduser传参 -> user存为token -> 上一次访问的时候 /token/info接口解析token
    const { access_token } = await this.authService.login(user);
    response.setCookie('jwt', access_token, { path: '/'});
    return access_token;
  }
  @ApiOperation({
    summary: '登出接口, 清除cookie'
  })
  @Get('/zjlab/logout')
  @Public()
  async toLogout(
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    response.clearCookie('jwt');
    return "clear token";
  }
}
