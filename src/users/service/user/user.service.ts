import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/user.js';
import { Repository } from 'typeorm';
import { UserDTO } from '../../../DTO/user.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUser: UserDTO) {
    const newUser = this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
}
