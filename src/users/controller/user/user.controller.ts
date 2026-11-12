import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import { UserService } from '../../service/user/user.service.js';
import { UserDTO } from '../../../DTO/user.dto.js';
import type { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  @Render('login')
  renderLogin() {
    return null;
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('isLoggedIn');
    return res.redirect('/mystore/home');
  }

  @Post('sign-up')
  @Redirect('/mystore/home')
  async signUp(@Body() newUser: UserDTO) {
    return await this.userService.createUser(newUser);
  }

  @Post('login')
  async userLogin(@Body() body: UserDTO, @Res() res: Response) {
    const { username, password } = body;

    const user = await this.userService.findUserByUsername(username);

    if (user) {
      if (user && user.password === password) {
        res.cookie('isLoggedIn', 'true');
        return res.redirect('/mystore/home');
      } else {
        res.cookie('isLoggedIn', 'invalidPassword');
        return res.redirect('/user/login');
      }
    } else {
      res.cookie('isLoggedIn', 'invalidUsername');
      return res.redirect('/user/login');
    }
  }
}
