import {
  Body,
  Controller,
  Get,
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
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('login')
  @Render('login')
  renderLogin(
    @Req() req: Request,
    @Query('message') message: string,
    @Query('username') username: string,
  ) {
    const isLoggedIn = req.session.isLoggedIn || 'false';
    return { isLoggedIn: global.isLoggedIn, username, message };
  }

  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Failed to destroy session:', err);
        return res.status(500).send('Failed to destroy session');
      }
      global.isLoggedIn = 'false';
      res.clearCookie('connect.sid');
      return res.redirect('/mystore/home');
    });
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
      const isMatch = await this.userService.comparePasswords(
        password,
        user.password,
      );

      if (isMatch) {
        const token = this.jwtService.sign({ username });
        req.session.token = token;

        req.session.save((err) => {
          if (err) {
            console.error('Failed to save session:', err);
            return res.status(500).send('Failed to save session');
          }
          return res.redirect('/mystore/home');
        });
      } else {
        global.isLoggedIn = 'false';
        req.session.destroy(() => {
          return res.redirect(
            `/user/login?message=Invalid password. Please try again.&username=${username}`,
          );
        });
      }
    } else {
      global.isLoggedIn = 'false';
      req.session.destroy(() => {
        return res.redirect(
          `/user/login?message=Not a registered user. Please sign up.&username=${username}`,
        );
      });
    }
  }
}
