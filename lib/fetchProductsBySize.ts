import type { Product } from "@/types/product"
import { normalizeTireSize, getTireSize } from "@/lib/woocommerce"
import { fetchAllProductTags, filterTireSizeTags } from "./fetchTags"

export async function fetchProductsBySize(
  size: string,
  page = 1,
  perPage = 100, // Збільшуємо кількість продуктів на сторінці для кращого пошуку
): Promise<{ products: Product[]; totalPages: number }> {
  const API_URL = "https://teslafun.top/wp-json/wc/v3"
  const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY || ""
  const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET || ""

  try {
    // Спочатку спробуємо знайти продукти за тегами
    const normalizedSearchSize = normalizeTireSize(size)
    console.log("Шукаємо розмір:", size)
    console.log("Нормалізований розмір для пошуку:", normalizedSearchSize)

    // Отримуємо всі теги
    const allTags = await fetchAllProductTags()
    const sizeTags = filterTireSizeTags(allTags)

    console.log(`Знайдено ${sizeTags.length} тегів розмірів шин`)

    // Шукаємо теги, які відповідають розміру шини
    const matchingTags = sizeTags.filter((tag) => {
      const tagName = tag.name || ""
      const normalizedTagName = normalizeTireSize(tagName)

      // Перевіряємо різні варіанти співпадіння
      const isMatch =
        normalizedTagName === normalizedSearchSize ||
        normalizedTagName.includes(normalizedSearchSize) ||
        normalizedSearchSize.includes(normalizedTagName) ||
        // Додаткова перевірка для розмірів з префіксами VF, IF
        normalizedTagName === normalizedSearchSize.replace(/^(vf|if)/, "") ||
        normalizedSearchSize === normalizedTagName.replace(/^(vf|if)/, "")

      if (isMatch) {
        console.log(`Знайдено відповідний тег: ${tagName} (нормалізований: ${normalizedTagName})`)
      }

      return isMatch
    })

    // Якщо знайдено відповідні теги, отримуємо продукти за цими тегами
    if (matchingTags.length > 0) {
      console.log(`Знайдено ${matchingTags.length} відповідних тегів`)

      // Створюємо масив для зберігання всіх продуктів
      let allProducts: Product[] = []

      // Отримуємо продукти для кожного тегу
      for (const tag of matchingTags) {
        console.log(`Отримуємо продукти для тегу ${tag.name} (ID: ${tag.id})`)

        const tagProductsResponse = await fetch(
          `${API_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&tag=${tag.id}&per_page=${perPage}&page=${page}`,
          { next: { revalidate: 3600 } },
        )

        if (!tagProductsResponse.ok) {
          console.error(`Failed to fetch products for tag ${tag.name}: ${tagProductsResponse.status}`)
          continue
        }

        const tagProducts = await tagProductsResponse.json()
        console.log(`Отримано ${tagProducts.length} продуктів для тегу ${tag.name}`)
        allProducts = [...allProducts, ...tagProducts]
      }

      // Видаляємо дублікати продуктів
      const uniqueProducts = Array.from(new Map(allProducts.map((product) => [product.id, product])).values())

      console.log(`Знайдено ${uniqueProducts.length} унікальних продуктів за тегами`)
      return { products: uniqueProducts, totalPages: 1 } // Повертаємо всі продукти на одній сторінці
    }

    // Якщо не знайдено відповідних тегів, отримуємо всі продукти і фільтруємо їх на клієнті
    console.log("Відповідних тегів не знайдено, шукаємо за атрибутами та назвою")

    const productsResponse = await fetch(
      `${API_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${perPage}&page=${page}`,
      { next: { revalidate: 3600 } },
    )

    if (!productsResponse.ok) {
      throw new Error(`Failed to fetch products: ${productsResponse.status}`)
    }

    const products = await productsResponse.json()
    const totalPages = Number(productsResponse.headers.get("X-WP-TotalPages") || "1")

    // Фільтруємо продукти за розміром на клієнті
    const filteredProducts = products.filter((product: Product) => {
      const tireSize = getTireSize(product)
      const normalizedProductSize = normalizeTireSize(tireSize)

      // Додаємо логування для відстеження
      console.log(`Продукт ${product.id}: розмір = ${tireSize}, нормалізований = ${normalizedProductSize}`)

      // Перевіряємо різні варіанти співпадіння
      const isMatch =
        normalizedProductSize === normalizedSearchSize ||
        normalizedProductSize.includes(normalizedSearchSize) ||
        normalizedSearchSize.includes(normalizedProductSize) ||
        // Додаткова перевірка для розмірів з префіксами VF, IF
        normalizedProductSize === normalizedSearchSize.replace(/^(vf|if)/, "") ||
        normalizedSearchSize === normalizedProductSize.replace(/^(vf|if)/, "") ||
        // Перевірка на співпадіння без урахування пробілів та регістру
        tireSize
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(size.toLowerCase().replace(/\s+/g, ""))

      if (isMatch) {
        console.log(`СПІВПАДІННЯ - Продукт ${product.id}: розмір = ${tireSize}`)
      } else {
        console.log(`НЕ СПІВПАДАЄ - Продукт ${product.id}: розмір = ${tireSize}`)
      }

      return isMatch
    })

    console.log(`Знайдено ${filteredProducts.length} продуктів з розміром ${size}`)
    return { products: filteredProducts, totalPages }
  } catch (error) {
    console.error("Error fetching products by size:", error)
    return { products: [], totalPages: 0 }
  }
}
