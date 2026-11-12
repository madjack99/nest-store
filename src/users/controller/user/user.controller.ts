import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from '../../service/user/user.service.js';
import { UserDTO } from '../../../DTO/user.dto.js';
import type { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  @Render('login')
  renderLogin(@Req() req: Request) {
    const isLoggedIn = req.session.isLoggedIn || 'false';
    return { isLoggedIn };
  }

  @Get('logout')
  @Redirect('/mystore/home')
  logout(@Res() res: Response, @Req() req: Request) {
    req.session.isLoggedIn = 'false';
  }

  @Post('sign-up')
  @Redirect('/mystore/home')
  async signUp(@Body() newUser: UserDTO) {
    return await this.userService.createUser(newUser);
  }

  @Post('login')
  async userLogin(
    @Body() body: UserDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { username, password } = body;

    const user = await this.userService.findUserByUsername(username);

    if (user) {
      if (user && user.password === password) {
        req.session.isLoggedIn = 'true';
        return res.redirect('/mystore/home');
      } else {
        req.session.isLoggedIn = 'invalidPassword';
        return res.redirect('/user/login');
      }
    } else {
      req.session.isLoggedIn = 'invalidUsername';
      return res.redirect('/user/login');
    }
  }
}
