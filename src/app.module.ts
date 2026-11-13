import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './products/module/product/product.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.js';
import { UserController } from './users/controller/user/user.controller.js';
import { UserService } from './users/service/user/user.service.js';
import { UserModule } from './users/module/user/user.module.js';
import { User } from './entities/user.js';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from './middleware/auth/auth.middleware.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestmysql',
      synchronize: true,
      entities: [Product, User],
    }),
    ProductModule,
    UserModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/user/login',
          method: RequestMethod.ALL,
        },
        {
          path: '/user/sign-up',
          method: RequestMethod.ALL,
        },
        {
          path: '/mystore/sign-up',
          method: RequestMethod.GET,
        },
        {
          path: '/user/logout',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes('*');
  }
}
