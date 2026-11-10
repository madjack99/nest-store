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

  @Column('int', { nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
