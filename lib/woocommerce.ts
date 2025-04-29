import type { Product } from "@/types/product"

const API_URL = "https://teslafun.top/wp-json/wc/v3"
const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY || ""
const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET || ""

// Перевірка наявності ключів
if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.warn("WooCommerce API keys are not set. Please check your environment variables.")
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
    // Спеціальний запит для отримання всіх атрибутів розміру шин
    // Використовуємо атрибути WooCommerce для отримання всіх можливих значень
    const response = await fetch(
      `${API_URL}/products/attributes?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch attributes: ${response.status}`)
    }

    const attributes = await response.json()

    // Знаходимо атрибут розміру (може мати різні назви)
    const sizeAttribute = attributes.find(
      (attr: any) => attr.name.toLowerCase().includes("розмір") || attr.name.toLowerCase().includes("size"),
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

// Оновлена функція нормалізації розмірів шин
export function normalizeTireSize(size: string): string {
  if (!size) return ""

  // Перетворюємо на нижній регістр
  let normalized = size.toLowerCase()

  // Видаляємо префікс VF, IF, якщо він є
  normalized = normalized.replace(/^(vf|if)\s*/i, "")

  // Замінюємо всі пробіли
  normalized = normalized.replace(/\s+/g, "")

  // Замінюємо всі "/" на "-"
  normalized = normalized.replace(/\//g, "-")

  // Замінюємо крапки на дефіси (для розмірів типу 9.5L-15 -> 9-5l-15)
  normalized = normalized.replace(/\.(\d)/g, "-$1")

  // Замінюємо "r" або "R" на "r" для уніфікації
  normalized = normalized.replace(/r/gi, "r")

  // Замінюємо подвійні дефіси на одинарні, якщо такі є
  normalized = normalized.replace(/--+/g, "-")

  // Видаляємо дефіси на початку і в кінці, якщо такі є
  normalized = normalized.replace(/^-|-$/g, "")

  return normalized
}

// Функція для отримання розміру шини з тегів продукту
export function getTireSizeFromTags(product: Product): string | null {
  if (!product.tags || product.tags.length === 0) {
    return null
  }

  // Шукаємо тег, який схожий на розмір шини
  for (const tag of product.tags) {
    const tagName = tag.name || ""
    // Перевіряємо, чи тег схожий на розмір шини
    if (
      /\d/.test(tagName) && // Містить хоча б одну цифру
      (/\//.test(tagName) || // Містить /
        /[rR]/.test(tagName) || // Містить R або r
        /\./.test(tagName) || // Містить .
        /-/.test(tagName) || // Містить -
        /[lL]/.test(tagName)) // Містить L або l (для шин типу 9.5L-15)
    ) {
      return tagName
    }
  }

  return null
}

export function getTireSize(product: Product): string {
  // Спочатку шукаємо в тегах
  const tagSize = getTireSizeFromTags(product)
  if (tagSize) {
    return tagSize
  }

  // Потім шукаємо в атрибутах
  const sizeAttribute = product.attributes?.find(
    (attr) =>
      attr.name.toLowerCase() === "розмір" ||
      attr.name.toLowerCase() === "size" ||
      attr.name.toLowerCase() === "розмір шини" ||
      attr.name.toLowerCase() === "tire size",
  )

  if (sizeAttribute && sizeAttribute.options.length > 0) {
    return sizeAttribute.options[0]
  }

  // Потім шукаємо в мета-даних
  const sizeMeta = product.meta_data?.find(
    (meta) =>
      meta.key.toLowerCase() === "розмір_шини" ||
      meta.key.toLowerCase() === "tire_size" ||
      meta.key.toLowerCase() === "pa_розмір" ||
      meta.key.toLowerCase() === "pa_size",
  )

  if (sizeMeta) {
    return sizeMeta.value
  }

  // Шукаємо в назві продукту
  const nameMatch = product.name.match(/\d+\/\d+\s*R\s*\d+/i)
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
