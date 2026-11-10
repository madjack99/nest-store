import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { products } from './products/product.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('mystore')
  @Render('home')
  renderPage() {
    return { products };
  }
}
