import { fetchAllProductTags, filterTireSizeTags } from "./fetchTags"

// Функція для отримання всіх розмірів шин з тегів
export async function fetchAllTyreSizes(): Promise<string[]> {
  try {
    // Отримуємо всі теги
    const allTags = await fetchAllProductTags()

    // Фільтруємо теги, які є розмірами шин
    const sizeTags = filterTireSizeTags(allTags)

    // Витягуємо назви тегів
    const sizes = sizeTags.map((tag) => tag.name)

    // Якщо не знайдено жодного тегу з розміром, спробуємо отримати розміри з атрибутів
    if (sizes.length === 0) {
      console.log("No size tags found, falling back to attributes")
      return fetchSizesFromAttributes()
    }

    console.log(`Found ${sizes.length} tire size tags`)

    // Сортуємо та повертаємо унікальні розміри
    return Array.from(new Set(sizes)).sort()
  } catch (error) {
    console.error("Error fetching tire sizes from tags:", error)
    // Якщо сталася помилка, спробуємо отримати розміри з атрибутів
    return fetchSizesFromAttributes()
  }
}

// Резервна функція для отримання розмірів з атрибутів
async function fetchSizesFromAttributes(): Promise<string[]> {
  const API_URL = "https://teslafun.top/wp-json/wc/v3"
  const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY || ""
  const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET || ""

  try {
    // Отримуємо всі атрибути
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
      console.warn("Size attribute not found, falling back to product-based sizes")
      return []
    }

    // Отримуємо всі терміни для цього атрибуту
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

    return Array.from(new Set(sizes)).sort()
  } catch (error) {
    console.error("Error fetching sizes from attributes:", error)
    return []
  }
}
