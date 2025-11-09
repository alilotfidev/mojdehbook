import { Repository } from "typeorm";
import { Product } from "../db/entities/Product";
import { AppDataSource } from "../data-source";

export class ProductRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async save(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repository.create(product);
    return await this.repository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByUrl(url: string): Promise<Product | null> {
    return await this.repository.findOneBy({ url });
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    await this.repository.update(id, product);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Product with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
