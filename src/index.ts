import { AppDataSource } from "./data-source";
import { scrapeProducts } from "./scaper/ProductScraper";
import "reflect-metadata";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    await scrapeProducts();

    console.log("Scraping finished!");
    process.exit(0); // optional, closes Node
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
