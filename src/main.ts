import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { fileURLToPath } from 'node:url';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';

const MySQLStore = MySQLStoreFactory(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(fileURLToPath(new URL('../public', import.meta.url)));
  app.setBaseViewsDir(fileURLToPath(new URL('../views', import.meta.url)));
  app.setViewEngine('ejs');
  app.use(methodOverride('_method'));
  app.use(cookieParser());

  const options = {
    connectionLimit: 10,
    port: 3306,
    host: 'localhost',
    database: 'nestmysql',
    user: 'root',
    password: '',
    createDatabaseTable: true,
  };

  const sessionStore = new MySQLStore(options);

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    }),
  );
  await app.listen(process.env.PORT ?? 5000);
}
await bootstrap();
