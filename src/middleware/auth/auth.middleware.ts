import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

global.isLoggedIn = 'init';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: () => void) {
    const token = req.session.token;
    console.log(token);
    const publicPaths = ['/user/login', '/user/sign-up', '/user/logout'];

    if (publicPaths.includes(req.path)) {
      return next();
    }

    if (token) {
      try {
        const decodedToken = this.jwtService.verify(token);
        req.user = decodedToken;
        global.isLoggedIn = 'true';
        next();
      } catch (error) {
        if (global.isLoggedIn === 'init') {
          next();
        } else {
          global.isLoggedIn = 'false';
          return res.redirect('/user/login');
        }
      }
    } else {
      global.isLoggedIn = 'false';
      return res.redirect('/user/login');
    }
  }
}
