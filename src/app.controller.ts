import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { ProductService } from './products/service/product/product.service.js';

@Controller('mystore')
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @Get('home')
  @Render('home')
  async renderPage() {
    const products = await this.productService.getAll();
    console.log(products);
    return { products };
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
