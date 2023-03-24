import { In, Like, Raw, MongoRepository, Repository } from 'typeorm';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { User  } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)  private cacheManager: Cache,
  ) { }

  createOrSave(user) {
    return this.usersRepository.save(user)
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }
  
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async storeRedisByUsername(verifyCode: string, username: string): Promise<any> {
    return await this.cacheManager.set(username, verifyCode, {ttl: 10 * 60});
 }
  async storeRedisForUserRegister(verifyCode: string, registerInfo: string): Promise<any> {
    return await this.cacheManager.set(verifyCode, registerInfo, {ttl: 10 * 60});
  }
  async getRegisterInfoByVerifyCode(verifyCode: string): Promise<string> {
    return await this.cacheManager.get(verifyCode);
  }
  async getRedisByUsername(username: string): Promise<any> {
    return await this.cacheManager.get(username);
  }
 
  async registerUser(registerInfo): Promise<any> {
   const userExist = await this.findOne(registerInfo.username);
   if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(registerInfo.email)) {
    throw new Error('邮箱名不符合规则')
  }
   if (userExist) {
    throw new Error('当前注册邮箱已存在');
   }

  //  return await this.usersRepository.save(registerInfo);
  }

  async retrieveUser(retrieveInfo): Promise<any> {
    const userExist = await this.findOne(retrieveInfo.username);
    if (!userExist) {
      throw new Error('当前邮箱不存在');
     }
    return userExist;
  }

  async updateColumn(username: string, property: {[key: string]: any}): Promise<any> {
    const userExist = await this.findOne(username);
    if (!userExist) {
     throw new Error('查找用户不存在');
    }
    return await this.createOrSave({
      ...userExist,
      ...property,
    })
  }

  async updatePassword(username: string, password: string, verifyCode: string): Promise<any> {
    const redisCode = await this.getRedisByUsername(username);
    if (!verifyCode || verifyCode !== redisCode) {
      throw new Error('校验码错误');
    }
    return await this.updateColumn(username, { password });
  }
  async activateAccount(username: string): Promise<any> {
    return await this.updateColumn(username, {'active': true });
  }
  async loginWithPassWord(username: string, password: string): Promise<any> {
    const user: User = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new Error('用户不存在');
    }
    if (user.password !== password) {
      throw new Error('密码错误');
    }
    if (!Boolean(user.active)) {
      throw new Error('用户未激活');
    }
    return user;
  
  }
  generateVerificationCode() {
    const reg = /(.+)(?=.*\1.*)/
    const code = Math.random()
    .toString(36)
    .slice(2, 6)
    if (reg.test(code)) {
    return code
    } else {
    return this.generateVerificationCode()
    }
  }
}