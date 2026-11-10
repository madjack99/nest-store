import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
} from '@nestjs/common';
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

  @Get('edit-product/:id')
  @Render('edit-product')
  renderEditProductPage(@Param('id') id: string) {
    const product = products.find((p) => p.id === parseInt(id));
    if (product) {
      return { product };
    } else {
      throw new NotFoundException('Product not found');
    }
  }
}
