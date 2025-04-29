// Функція для отримання всіх тегів продуктів
export async function fetchAllProductTags() {
  const API_URL = "https://teslafun.top/wp-json/wc/v3"
  const CONSUMER_KEY = process.env.WOOCOMMERCE_KEY || ""
  const CONSUMER_SECRET = process.env.WOOCOMMERCE_SECRET || ""

  const allTags: any[] = []
  const perPage = 100
  let page = 1
  let fetched = []

  try {
    do {
      console.log(`Fetching tags page ${page}...`)
      const response = await fetch(
        `${API_URL}/products/tags?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${perPage}&page=${page}`,
        { next: { revalidate: 3600 } }, // Кешуємо на годину
      )

      if (!response.ok) {
        throw new Error(`Error fetching tags: ${response.status}`)
      }

      fetched = await response.json()
      allTags.push(...fetched)
      console.log(`Fetched ${fetched.length} tags from page ${page}`)
      page++
    } while (fetched.length === perPage)

    console.log(`Total tags fetched: ${allTags.length}`)
    return allTags
  } catch (error) {
    console.error("Error fetching all product tags:", error)
    return []
  }
}

// Функція для фільтрації тегів, які є розмірами шин
export function filterTireSizeTags(tags: any[]) {
  // Фільтруємо теги, які можуть бути розмірами шин
  // Розміри шин зазвичай містять цифри та символи /, R, -, .
  const sizeTags = tags.filter((tag) => {
    const name = tag.name || ""
    // Перевіряємо, чи тег схожий на розмір шини
    return (
      /\d/.test(name) && // Містить хоча б одну цифру
      (/\//.test(name) || // Містить /
        /[rR]/.test(name) || // Містить R або r
        /\./.test(name) || // Містить .
        /-/.test(name) || // Містить -
        /[lL]/.test(name)) // Містить L або l (для шин типу 9.5L-15)
    )
  })

  return sizeTags
}
