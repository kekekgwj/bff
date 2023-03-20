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
  async getRedisByUsername(username: string): Promise<any> {
    return await this.cacheManager.get(username);
  }
 
  async registerUser(registerInfo): Promise<any> {
   const userExist = await this.findOne(registerInfo.username);
   if (userExist) {
    throw new Error('当前注册邮箱已存在');
   }
   return await this.usersRepository.save(registerInfo);
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
  async activateAccount(username: string): Promise<any> {
    return await this.updateColumn(username, {'active': true });
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