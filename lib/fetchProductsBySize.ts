import type { Product } from "@/types/product"

export async function fetchProductsBySize(
  size: string,
  page = 1,
  perPage = 40,
): Promise<{ products: Product[]; totalPages: number }> {
  const API_URL = "https://teslafun.top/wp-json/wc/v3"
  const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY || ""
  const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET || ""

  try {
    // Спочатку отримуємо всі атрибути, щоб знайти ID атрибуту розміру шин
    const attributesResponse = await fetch(
      `${API_URL}/products/attributes?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`,
      { next: { revalidate: 3600 } },
    )

    if (!attributesResponse.ok) {
      throw new Error(`Failed to fetch attributes: ${attributesResponse.status}`)
    }

    const attributes = await attributesResponse.json()

    // Знаходимо атрибут розміру
    const sizeAttribute = attributes.find(
      (attr: any) =>
        attr.name.toLowerCase().includes("розмір") ||
        attr.name.toLowerCase().includes("size") ||
        attr.name.toLowerCase().includes("tire") ||
        attr.name.toLowerCase().includes("шин"),
    )

    if (!sizeAttribute) {
      throw new Error("Size attribute not found")
    }

    // Знаходимо ID терміну для вказаного розміру
    const termsResponse = await fetch(
      `${API_URL}/products/attributes/${sizeAttribute.id}/terms?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&search=${encodeURIComponent(size)}`,
      { next: { revalidate: 3600 } },
    )

    if (!termsResponse.ok) {
      throw new Error(`Failed to fetch attribute terms: ${termsResponse.status}`)
    }

    const terms = await termsResponse.json()
    const sizeTerm = terms.find((term: any) => term.name === size)

    // Якщо термін не знайдено, повертаємо пустий результат
    if (!sizeTerm) {
      return { products: [], totalPages: 0 }
    }

    // Отримуємо продукти за атрибутом і терміном
    const attributeSlug = sizeAttribute.slug || `pa_${sizeAttribute.name.toLowerCase().replace(/\s+/g, "-")}`

    const productsResponse = await fetch(
      `${API_URL}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&attribute=${attributeSlug}&attribute_term=${sizeTerm.id}&per_page=${perPage}&page=${page}`,
      { next: { revalidate: 3600 } },
    )

    if (!productsResponse.ok) {
      throw new Error(`Failed to fetch products: ${productsResponse.status}`)
    }

    const products = await productsResponse.json()
    const totalPages = Number(productsResponse.headers.get("X-WP-TotalPages") || "1")

    return { products, totalPages }
  } catch (error) {
    console.error("Error fetching products by size:", error)
    return { products: [], totalPages: 0 }
  }
}
