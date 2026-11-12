import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './products/module/product/product.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.js';
import { UserController } from './users/controller/user/user.controller.js';
import { UserService } from './users/service/user/user.service.js';
import { UserModule } from './users/module/user/user.module.js';
import { User } from './entities/user.js';
import { JwtModule } from '@nestjs/jwt';

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
        expiresIn: '60m'
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
