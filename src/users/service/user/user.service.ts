import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/user.js';
import { Repository } from 'typeorm';
import { UserDTO } from '../../../DTO/user.dto.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUser: UserDTO) {
    const hashedPassword = await bcrypt.hash(createUser.password, 10);

    const newUser = this.userRepository.create({
      ...createUser,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser).catch((err) => {
      console.log(`Error saving the user: ${err.message}`);
    });
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
