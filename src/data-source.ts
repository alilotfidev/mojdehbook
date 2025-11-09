import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "./db/entities/Product";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "data.sqlite",
  entities: [Product],
  synchronize: true, // auto-creates tables
  logging: true,
});
