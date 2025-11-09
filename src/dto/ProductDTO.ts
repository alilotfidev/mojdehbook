export interface ScrapedProductDTO {
  title: string;
  author?: string;
  rating?: string;
  price: string;
  url: string;
  image?: string;
}

export interface CreateProductDTO {
  name: string;
  author?: string;
  rating?: string;
  price: string;
  url: string;
  image?: string;
}
