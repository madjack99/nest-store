import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { ProductService } from './products/service/product/product.service.js';
import type { Request } from 'express';

@Controller('mystore')
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @Get('home')
  @Render('home')
  async renderPage(@Req() req: Request) {
    const cookie = req.cookies;

    const products = await this.productService.getAll();
    return { products, isLoggedIn: cookie.isLoggedIn };
  }

  @Get('add-product')
  @Render('add-product')
  renderAddProductPage() {
    return null;
  }

  @Get('sign-up')
  @Render('sign-up')
  renderSignUpPage() {
    return null;
  }
}
