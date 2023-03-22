import {
  Controller,
  UseGuards,
  Res,
  Get,
  Query,
  VERSION_NEUTRAL,
  Header,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZjlabAuthGuard } from './guards/zjlab-auth.guard'
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetZjLabUserInfo, UserLoginInfo } from './auth.dto';
import { Public } from './constants';
import { PayloadUser } from '@/helper';
import { FastifyReply } from 'fastify'
import { UserService } from 'src/user/user.service';
import { UserRegister, UserVerify } from '@/user/user.dto';
import { User } from '@/user/entities/user.entity';
import { ZjlabService } from '@/user/zjlab/zjlab.service';

@ApiTags('用户认证')
@Controller({
  path: 'auth',
  version: [VERSION_NEUTRAL]
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private readonly zjlabService: ZjlabService,
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
  @Get('/jwt-login') 
  @Header('access-control-expose-headers', 'Set-Cookie')
  async getZJLabToken(
    @PayloadUser() user: UserLoginInfo,
    @Res({ passthrough: true }) response: FastifyReply,
    @Query() query: GetZjLabUserInfo,
    ) {
    // zjlabAuthguard 的validate把user挂载ctx.request -> @payloaduser传参 -> user存为token -> 下一次访问的时候 /token/info接口解析token
    const { access_token } = await this.authService.login(user);
    response.setCookie('jwt', access_token, { path: '/'});
    return access_token;
  }
  @ApiOperation({
    summary: '登出接口, 清除cookie'
  })
  @Get('/logout')
  @Public()
  async toLogout(
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    response.clearCookie('jwt');
    return "clear token";
  }

  @ApiOperation({
    summary: '使用账号密码登录'
  })
  @Post('/login')
  @Public()
  async passWordLogin(
    @Body() body: UserLoginInfo,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    try {
      const { username, password } = body;
      const userInfo = await this.userService.loginWithPassWord(username, password);
      const { access_token } = await this.authService.login({ username, password });
      response.setCookie('jwt', access_token, { path: '/'});
      return userInfo;
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.UNAUTHORIZED)
    }
    // return this.authService.storeRedis();
  }
  @ApiOperation({ summary: '注册' })
  @Post('/register')
  @Public()
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
      await this.userService.registerUser(registerInfo);
      const verifyCode = this.userService.generateVerificationCode();
      await this.zjlabService.smtpServerRegister(verifyCode, body.email);
      await this.userService.storeRedisByUsername(verifyCode, body.username);
      return '注册成功，等待激活';
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.UNAUTHORIZED);
    }
  }
  @ApiOperation({ summary: '找回密码' })
  @Post('/retrieve')
  @Public()
  async retrieve(
    @Body() body: UserRegister
  ) {
    const retrieveInfo: Pick<User, 'username'> = {
      username: body.username,
    };
    try {
      await this.userService.retrieveUser(retrieveInfo);
      const verifyCode = this.userService.generateVerificationCode();
      // 发送验证码
      await this.zjlabService.smtpServerRetrievePassword(verifyCode, body.username);
      // 双向存储
      await this.userService.storeRedisByUsername(body.username, verifyCode);
      await this.userService.storeRedisByUsername(verifyCode, body.username);
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.UNAUTHORIZED);
    }
  }
  @ApiOperation({ summary: '密码重置' })
  @Post('/reset')
  @Public()
  async reset(
    @Body() body: UserVerify 
  ) {
    const { password, verifyCode } = body;
    try {
      const username = await this.userService.getRedisByUsername(verifyCode);
      // const user = await this.userService.retrieveUser({ username });
      await this.userService.updatePassword(username, password, verifyCode);
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.UNAUTHORIZED);
    }
  }
}
