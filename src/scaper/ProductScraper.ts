import puppeteer from "puppeteer";
import { AppDataSource } from "../data-source";
import { ProductFactory } from "../factories/ProductFactory";
import { ProductRepository } from "../repositories/ProductRepository";

export async function scrapeProducts() {
  const productRepository = new ProductRepository();
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the homepage
  await page.goto("https://www.mojdehbook.com/", { waitUntil: "networkidle2" });

  // Wait until the slider exists and has at least one visible slide
  await page.waitForFunction(() => {
    const ul = document.querySelectorAll("ul.splide__list")[1];
    return ul && ul.querySelectorAll("li.splide__slide").length > 0;
  });

  // Scroll through all slides to force lazy-loaded images to render
  await page.evaluate(async () => {
    const container = document.querySelectorAll("ul.splide__list")[1];
    if (!container) return;

    const items = Array.from(container.querySelectorAll("li.splide__slide"));

    for (const item of items) {
      item.scrollIntoView({ behavior: "auto", block: "center" });
      // small delay to allow images to load
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  });

  // Scrape all slides
  const books = await page.evaluate(() => {
    const container = document.querySelectorAll("ul.splide__list")[1];
    if (!container) return [];

    const items = Array.from(container.querySelectorAll("li.splide__slide"));

    return items.map((item) => {
      const linkEl = item.querySelector("a[title]") as HTMLAnchorElement;
      const titleEl = item.querySelector("a > p.line-clamp-1") as HTMLElement;
      const authorEl = item.querySelector(
        "div > span.text-gray-600"
      ) as HTMLElement;
      const ratingEl = item.querySelector(
        "div.flex.items-center.gap-1 > div > span"
      ) as HTMLElement;
      const imgEl = linkEl?.querySelector("img") as HTMLImageElement;
      const priceEl = item.querySelector("p.font-bold.text-lg") as HTMLElement;

      let image = "";
      if (imgEl) {
        const srcset = imgEl.getAttribute("srcset");
        image = srcset
          ? srcset.split(",").pop()?.trim().split(" ")[0] ?? ""
          : imgEl.src;
      }

      return {
        url: linkEl?.href ?? "",
        title: titleEl?.innerText.trim() ?? "",
        author: authorEl?.innerText.trim() ?? "",
        rating: ratingEl?.innerText.trim() ?? "",
        image,
        price: priceEl?.innerText.trim() ?? "",
      };
    });
  });

  console.log(`Found ${books.length} books`);

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Save each book using the repository
  for (const b of books) {
    console.log(`saving: ${b.title}`);

    try {
      // Create product using factory
      const productDTO = ProductFactory.createFromScrapedData({
        title: b.title,
        author: b.author,
        rating: b.rating,
        price: b.price,
        url: b.url,
        image: b.image,
      });

      await productRepository.save(productDTO);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  }

  await browser.close();
  console.log("Scraping done!");
}
