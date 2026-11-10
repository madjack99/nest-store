import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../../service/product/product.service.js';
import { ProductDTO } from '../../../DTO/product.dto.js';
import { Product } from '../../../entities/product.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Redirect('/mystore/home')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req: any, file: any, cb: any) => {
          cb(null, new Date().toISOString() + file.originalname);
        },
      }),
    }),
  )
  async addProduct(
    @Body() productData: ProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      productData.image = file.filename;
    }
    return await this.productService.addProduct(productData);
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
