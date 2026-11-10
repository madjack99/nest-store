import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../../entities/product.js';
import { Repository } from 'typeorm';
import { ProductDTO } from '../../../DTO/product.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async addProduct(newProduct: ProductDTO) {
    const { productname, price } = newProduct;
    const product = this.productRepository.create({
      productname,
      price,
    });
    return await this.productRepository.save(product);
  }

  async getAll() {
    return await this.productRepository.find({ order: { price: 'DESC' } });
  }

  async getOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, updateData: ProductDTO) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.productRepository.merge(product, updateData);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return await this.productRepository.remove(product);
  }
}
