import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from '../../service/product/product.service.js';
import { ProductDTO } from '../../../DTO/product.dto.js';
import { Product } from '../../../entities/product.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async addProduct(@Body() productData: ProductDTO) {
    await this.productService.addProduct(productData);
    return 'Product added successfully';
  }

  @Get('getAll')
  async getAll() {
    return await this.productService.getAll();
  }

  @Get('getOne/:id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.productService.getOne(id);
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: ProductDTO,
  ) {
    await this.productService.updateProduct(id, updateData);
    return 'Product updated successfully';
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);
    return 'Product deleted successfully';
  }
}
