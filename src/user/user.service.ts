import { In, Like, Raw, MongoRepository, Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  createOrSave(user) {
    return this.usersRepository.save(user)
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }
  
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

}