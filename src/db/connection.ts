import { DataSource } from "typeorm";
import { Product } from "./entity/Product";
import "reflect-metadata";

class Database {
  private static instance: DataSource;

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new DataSource({
        type: "sqlite",
        database: "data.sqlite",
        entities: [Product],
        synchronize: true,
      });
    }
    return Database.instance;
  }
}

export default Database;
