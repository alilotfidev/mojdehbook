import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  price!: string;

  @Column()
  url!: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  rating?: string;

  @Column({ nullable: true })
  image?: string;
}
