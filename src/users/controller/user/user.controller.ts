import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
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
  renderLogin(
    @Req() req: Request,
    @Query('message') message: string,
    @Query('username') username: string,
  ) {
    const isLoggedIn = req.session.isLoggedIn || 'false';
    return { isLoggedIn, username, message };
  }

  @Get('logout')
  @Redirect('/mystore/home')
  logout(@Res() res: Response, @Req() req: Request) {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException('Failed to destroy session');
      }
    });
    res.clearCookie('connect.sid');
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
        req.session.username = username;
        req.session.message = '';
        req.session.save((err) => {
          console.log(err);
        });

        return res.redirect('/mystore/home');
      } else {
        req.session.isLoggedIn = 'invalidPassword';
        req.session.destroy(() => {
          return res.redirect(
            `/user/login?message=Invalid password. Please try again.&username=${username}`,
          );
        });
      }
    } else {
      req.session.isLoggedIn = 'invalidUsername';
      req.session.destroy(() => {
        return res.redirect(
          `/user/login?message=Not a registered user. Please sign up.&username=${username}`,
        );
      });
    }
  }
}
