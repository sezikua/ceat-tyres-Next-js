// Функція для отримання всіх розмірів шин з пагінацією
export async function fetchAllTyreSizes(): Promise<string[]> {
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

    // Знаходимо атрибут розміру (може мати різні назви)
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

    // Отримуємо всі терміни для цього атрибуту з пагінацією
    let page = 1
    let hasMoreTerms = true
    const allTerms: string[] = []

    while (hasMoreTerms) {
      const termsResponse = await fetch(
        `${API_URL}/products/attributes/${sizeAttribute.id}/terms?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100&page=${page}`,
        { next: { revalidate: 3600 } },
      )

      if (!termsResponse.ok) {
        throw new Error(`Failed to fetch attribute terms: ${termsResponse.status}`)
      }

      const terms = await termsResponse.json()

      // Додаємо назви термінів до загального масиву
      terms.forEach((term: any) => {
        allTerms.push(term.name)
      })

      // Перевіряємо, чи є ще сторінки
      const totalPages = Number(termsResponse.headers.get("X-WP-TotalPages") || "1")
      hasMoreTerms = page < totalPages
      page++
    }

    // Сортуємо та повертаємо унікальні розміри
    return Array.from(new Set(allTerms)).sort()
  } catch (error) {
    console.error("Error fetching tire sizes:", error)
    return []
  }
}
