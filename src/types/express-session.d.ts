import 'express-session';
import { User } from '../entities/user.ts';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: string;
    username?: string;
    message?: string;
    token?: string;
  }
}

declare global {
  var isLoggedIn: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
