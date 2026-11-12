import { Body, Controller, Post, Redirect } from '@nestjs/common';
import { UserService } from '../../service/user/user.service.js';
import { UserDTO } from '../../../DTO/user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @Redirect('/mystore/home')
  async signUp(@Body() newUser: UserDTO) {
    return await this.userService.createUser(newUser);
  }
}
