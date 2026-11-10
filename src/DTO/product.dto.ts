import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ProductDTO {
  @IsString()
  @IsNotEmpty({ message: 'Define a product name' })
  productname: string;

  @Min(0.01, { message: 'Price must be greater that 0' })
  price: number;
}
