import type { Product } from "@/types/product"

const API_URL = "https://teslafun.top/wp-json/wc/v3"
const CONSUMER_KEY = "ck_0b5789c8597c01a1fe5623cceb77e5c970970f25"
const CONSUMER_SECRET = "cs_14736558f44039e6cf6caa9ee13490c20ac87c14"

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

export function formatPrice(price: string): string {
  return `${Number.parseInt(price).toLocaleString("uk-UA")} ₴`
}

export function getTireSize(product: Product): string {
  const sizeAttribute = product.attributes?.find(
    (attr) =>
      attr.name.toLowerCase() === "розмір" ||
      attr.name.toLowerCase() === "size" ||
      attr.name.toLowerCase() === "розмір шини",
  )

  if (sizeAttribute && sizeAttribute.options.length > 0) {
    return sizeAttribute.options[0]
  }

  // Try to extract from meta data
  const sizeMeta = product.meta_data?.find(
    (meta) => meta.key.toLowerCase() === "розмір_шини" || meta.key.toLowerCase() === "tire_size",
  )

  if (sizeMeta) {
    return sizeMeta.value
  }

  // Try to extract from name
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
