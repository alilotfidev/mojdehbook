import { Product } from "../db/entities/Product";
import { CreateProductDTO, ScrapedProductDTO } from "../dto/ProductDTO";

export class ProductFactory {
  /**
   * Creates a Product entity from scraped data
   * Handles data transformation and validation
   */
  static createFromScrapedData(
    scrapedData: ScrapedProductDTO
  ): CreateProductDTO {
    // Validate required fields
    if (!scrapedData.title || !scrapedData.price || !scrapedData.url) {
      throw new Error("Missing required fields for product creation");
    }

    // Clean and transform data
    return {
      name: this.cleanTitle(scrapedData.title),
      author: scrapedData.author?.trim(),
      rating: this.normalizeRating(scrapedData.rating),
      price: this.normalizePrice(scrapedData.price),
      url: scrapedData.url.trim(),
      image: scrapedData.image?.trim(),
    };
  }

  /**
   * Creates a Product entity from CreateProductDTO
   */
  static createProduct(dto: CreateProductDTO): Product {
    const product = new Product();
    product.name = dto.name;
    product.author = dto.author;
    product.rating = dto.rating;
    product.price = dto.price;
    product.url = dto.url;
    product.image = dto.image;
    return product;
  }

  /**
   * Clean and normalize the book title
   */
  private static cleanTitle(title: string): string {
    return title
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[^\w\s\-]/g, ""); // Remove special characters except spaces and hyphens
  }

  /**
   * Normalize the rating format
   */
  private static normalizeRating(rating?: string): string | undefined {
    if (!rating) return undefined;
    // Remove any non-numeric characters except decimal point
    const normalizedRating = rating.replace(/[^\d.]/g, "");
    return normalizedRating || undefined;
  }

  /**
   * Normalize the price format
   */
  private static normalizePrice(price: string): string {
    // Remove currency symbols and normalize format
    return price
      .trim()
      .replace(/[^\d,]/g, "") // Remove all non-digit characters except comma
      .replace(/,/g, ""); // Remove commas
  }
}
