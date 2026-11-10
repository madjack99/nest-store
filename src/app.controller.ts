import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { products } from './products/product.js';

@Controller('mystore')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('home')
  @Render('home')
  renderPage() {
    return { products };
  }

  @Get('add-product')
  @Render('add-product')
  renderAddProductPage() {
    return null;
  }
}
