import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, length: 100 })
  productname: string;

  @Column('decimal', { nullable: false })
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}
