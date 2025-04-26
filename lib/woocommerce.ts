import type { Product } from "@/types/product"

const API_URL = "https://teslafun.top/wp-json/wc/v3"
const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY || ""
const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET || ""

// Перевірка наявності ключів
if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.warn("WooCommerce API keys are not set. Please check your environment variables.")
}

// Функція для перетворення розміру шини в slug
export function sizeToSlug(size: string): string {
  return size
    .toLowerCase()
    .replace(/[/.]/g, "-") // «750/75R46» → «750-75r46»
    .replace(/\s+/g, "")
}

export async function getProducts(page = 1, perPage = 40): Promise<{ products: Product[]; totalPages: number }> {
  try {
    const response = await fetch(
      `${API_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${perPage}&page=${page}`,
      { next: { revalidate: 3600 } }, // Revalidate every hour
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const products = await response.json()

    // Get total pages from headers
    const totalPages = Number.parseInt(response.headers.get("X-WP-TotalPages") || "1", 10)

    return { products, totalPages }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], totalPages: 0 }
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`)
    }

    const product = await response.json()
    return product
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return null
  }
}

export async function getAllTireSizes(): Promise<string[]> {
  try {
    // Спочатку отримуємо атрибут розміру
    const attributesResponse = await fetch(
      `${API_URL}/products/attributes?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&search=size`,
      { next: { revalidate: 3600 } },
    )

    if (!attributesResponse.ok) {
      throw new Error(`Failed to fetch attributes: ${attributesResponse.status}`)
    }

    const attributes = await attributesResponse.json()

    // Знаходимо атрибут розміру (може мати різні назви)
    const sizeAttribute = attributes.find(
      (attr: any) =>
        attr.slug === "pa_size" ||
        attr.slug === "pa_rozmir" ||
        attr.name.toLowerCase().includes("розмір") ||
        attr.name.toLowerCase().includes("size"),
    )

    if (!sizeAttribute) {
      console.warn("Size attribute not found, falling back to product-based sizes")
      return fetchSizesFromAllProducts()
    }

    // Отримуємо всі терміни (значення) для цього атрибуту
    const termsResponse = await fetch(
      `${API_URL}/products/attributes/${sizeAttribute.id}/terms?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100`,
      { next: { revalidate: 3600 } },
    )

    if (!termsResponse.ok) {
      throw new Error(`Failed to fetch attribute terms: ${termsResponse.status}`)
    }

    const terms = await termsResponse.json()

    // Витягуємо назви термінів (розміри шин)
    const sizes = terms.map((term: any) => term.name)

    return sizes.sort()
  } catch (error) {
    console.error("Error fetching all tire sizes:", error)
    // Якщо сталася помилка, спробуємо отримати розміри з усіх продуктів
    return fetchSizesFromAllProducts()
  }
}

// Резервний метод: отримання розмірів з усіх продуктів
async function fetchSizesFromAllProducts(): Promise<string[]> {
  try {
    const sizes = new Set<string>()
    let page = 1
    let hasMorePages = true

    // Отримуємо всі продукти постранично
    while (hasMorePages) {
      const { products, totalPages } = await getProducts(page, 100)

      products.forEach((product) => {
        const size = getTireSize(product)
        if (size && size !== "Не вказано") {
          sizes.add(size)
        }
      })

      page++
      hasMorePages = page <= totalPages
    }

    return Array.from(sizes).sort()
  } catch (error) {
    console.error("Error fetching sizes from all products:", error)
    return []
  }
}

export function formatPrice(price: string): string {
  return `${Number.parseInt(price).toLocaleString("uk-UA")} ₴`
}

export function getTireSize(product: Product): string {
  // Спочатку шукаємо в атрибутах
  const sizeAttribute = product.attributes?.find(
    (attr) =>
      attr.name.toLowerCase().includes("розмір") ||
      attr.name.toLowerCase().includes("size") ||
      attr.name.toLowerCase().includes("шин"),
  )

  if (sizeAttribute && sizeAttribute.options.length > 0) {
    return sizeAttribute.options[0]
  }

  // Потім шукаємо в мета-даних
  const sizeMeta = product.meta_data?.find(
    (meta) =>
      meta.key.toLowerCase().includes("розмір") ||
      meta.key.toLowerCase().includes("size") ||
      meta.key.toLowerCase().includes("шин"),
  )

  if (sizeMeta) {
    return sizeMeta.value
  }

  // Шукаємо в назві продукту
  const nameMatch = product.name.match(/\d+[/-]\d+\s*[rR]\s*\d+/i)
  if (nameMatch) {
    return nameMatch[0]
  }

  return "Не вказано"
}

export function getBrand(product: Product): string {
  if (product.brands && product.brands.length > 0) {
    return product.brands[0].name
  }

  // Try to find brand in attributes
  const brandAttribute = product.attributes?.find(
    (attr) =>
      attr.name.toLowerCase() === "бренд" ||
      attr.name.toLowerCase() === "brand" ||
      attr.name.toLowerCase() === "виробник",
  )

  if (brandAttribute && brandAttribute.options.length > 0) {
    return brandAttribute.options[0]
  }

  return "CEAT"
}

export function getUniqueTireSizes(products: Product[]): string[] {
  const sizes = new Set<string>()

  products.forEach((product) => {
    const size = getTireSize(product)
    if (size && size !== "Не вказано") {
      sizes.add(size)
    }
  })

  return Array.from(sizes).sort()
}

// Нова функція для пошуку продуктів за розміром через API WooCommerce
export async function searchProductsBySize(size: string): Promise<Product[]> {
  try {
    console.log(`Пошук продуктів з розміром: ${size}`)

    // 1. Перетворюємо розмір в slug
    const slug = sizeToSlug(size)
    console.log(`Slug розміру: ${slug}`)

    // 2. Отримуємо атрибут розміру
    const attributesResponse = await fetch(
      `${API_URL}/products/attributes?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&search=size`,
      { next: { revalidate: 3600 } },
    )

    if (!attributesResponse.ok) {
      throw new Error(`Failed to fetch attributes: ${attributesResponse.status}`)
    }

    const attributes = await attributesResponse.json()

    // Знаходимо атрибут розміру
    const sizeAttribute = attributes.find(
      (attr: any) =>
        attr.slug === "pa_size" ||
        attr.slug === "pa_rozmir" ||
        attr.name.toLowerCase().includes("розмір") ||
        attr.name.toLowerCase().includes("size"),
    )

    if (!sizeAttribute) {
      console.warn("Size attribute not found")
      return []
    }

    console.log(
      `Знайдено атрибут розміру: ${sizeAttribute.name} (id: ${sizeAttribute.id}, slug: ${sizeAttribute.slug})`,
    )

    // 3. Шукаємо термін (значення) атрибута за slug
    const termsResponse = await fetch(
      `${API_URL}/products/attributes/${sizeAttribute.id}/terms?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&slug=${slug}`,
      { next: { revalidate: 3600 } },
    )

    if (!termsResponse.ok) {
      throw new Error(`Failed to fetch attribute terms: ${termsResponse.status}`)
    }

    const terms = await termsResponse.json()

    if (!terms.length) {
      console.log(`Термін для розміру ${size} (slug: ${slug}) не знайдено`)

      // Спробуємо знайти термін за іншими варіантами slug
      const alternativeSlug = size
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/\./g, "-")
        .replace(/\s+/g, "")
        .replace(/r/i, "r")

      if (alternativeSlug !== slug) {
        console.log(`Спроба пошуку за альтернативним slug: ${alternativeSlug}`)

        const altTermsResponse = await fetch(
          `${API_URL}/products/attributes/${sizeAttribute.id}/terms?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&slug=${alternativeSlug}`,
          { next: { revalidate: 3600 } },
        )

        if (altTermsResponse.ok) {
          const altTerms = await altTermsResponse.json()

          if (altTerms.length) {
            console.log(`Знайдено термін за альтернативним slug: ${altTerms[0].name} (id: ${altTerms[0].id})`)

            // 4. Отримуємо продукти з цим терміном
            const productsResponse = await fetch(
              `${API_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&attribute=${sizeAttribute.slug}&attribute_term=${altTerms[0].id}&per_page=100`,
              { next: { revalidate: 3600 } },
            )

            if (productsResponse.ok) {
              const products = await productsResponse.json()
              console.log(`Знайдено ${products.length} продуктів з розміром ${size}`)
              return products
            }
          }
        }
      }

      // Якщо не знайдено за slug, спробуємо пошук за назвою терміна
      console.log(`Спроба пошуку за назвою терміна: ${size}`)

      const allTermsResponse = await fetch(
        `${API_URL}/products/attributes/${sizeAttribute.id}/terms?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100`,
        { next: { revalidate: 3600 } },
      )

      if (allTermsResponse.ok) {
        const allTerms = await allTermsResponse.json()

        // Шукаємо термін, який містить наш розмір
        const matchingTerm = allTerms.find((term: any) => {
          const termName = term.name.toLowerCase()
          const searchSize = size.toLowerCase()

          return (
            termName === searchSize ||
            termName.replace(/\//g, "-") === searchSize.replace(/\//g, "-") ||
            termName.replace(/-/g, "/") === searchSize.replace(/-/g, "/") ||
            termName.replace(/\s+/g, "") === searchSize.replace(/\s+/g, "") ||
            termName.replace(/r/i, "r") === searchSize.replace(/r/i, "r")
          )
        })

        if (matchingTerm) {
          console.log(`Знайдено відповідний термін: ${matchingTerm.name} (id: ${matchingTerm.id})`)

          // Отримуємо продукти з цим терміном
          const productsResponse = await fetch(
            `${API_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&attribute=${sizeAttribute.slug}&attribute_term=${matchingTerm.id}&per_page=100`,
            { next: { revalidate: 3600 } },
          )

          if (productsResponse.ok) {
            const products = await productsResponse.json()
            console.log(`Знайдено ${products.length} продуктів з розміром ${size}`)
            return products
          }
        }
      }

      // Якщо все ще не знайдено, повертаємо пустий масив
      return []
    }

    console.log(`Знайдено термін: ${terms[0].name} (id: ${terms[0].id})`)

    // 4. Отримуємо продукти з цим терміном
    const productsResponse = await fetch(
      `${API_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&attribute=${sizeAttribute.slug}&attribute_term=${terms[0].id}&per_page=100`,
      { next: { revalidate: 3600 } },
    )

    if (!productsResponse.ok) {
      throw new Error(`Failed to fetch products: ${productsResponse.status}`)
    }

    const products = await productsResponse.json()
    console.log(`Знайдено ${products.length} продуктів з розміром ${size}`)

    return products
  } catch (error) {
    console.error("Error searching products by size:", error)
    return []
  }
}
