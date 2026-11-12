import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: string;
    username?: string;
    message?: string;
  }
}
