// Функції для роботи з WordPress GraphQL API

// Базова функція для виконання GraphQL запитів
export async function fetchGraphQL(query: string, variables = {}) {
  try {
    const res = await fetch("https://teslafun.top/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 3600 }, // Кешуємо результати на годину
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch API, status: ${res.status}`)
    }

    const { data, errors } = await res.json()

    if (errors) {
      console.error("GraphQL Errors:", errors)
      throw new Error("Failed to fetch data from WordPress")
    }

    return data
  } catch (error) {
    console.error("Error fetching from WordPress:", error)
    throw error
  }
}

// Отримання списку постів з пагінацією
export async function getPosts(page = 1, perPage = 9) {
  const query = `
    query GetPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    }
  `

  // Розрахунок курсору для пагінації
  let after = null
  if (page > 1) {
    // Отримуємо курсор для попередньої сторінки
    const prevPageData = await fetchGraphQL(query, {
      first: perPage,
      after: null,
    })

    if (prevPageData?.posts?.pageInfo?.endCursor) {
      after = prevPageData.posts.pageInfo.endCursor

      // Якщо сторінка > 2, потрібно отримати курсор для потрібної сторінки
      for (let i = 2; i < page; i++) {
        const nextPageData = await fetchGraphQL(query, {
          first: perPage,
          after,
        })

        if (nextPageData?.posts?.pageInfo?.endCursor) {
          after = nextPageData.posts.pageInfo.endCursor
        } else {
          break
        }
      }
    }
  }

  const data = await fetchGraphQL(query, {
    first: perPage,
    after,
  })

  return {
    posts: data.posts.nodes,
    pageInfo: data.posts.pageInfo,
  }
}

// Отримання окремого поста за slug
export async function getPostBySlug(slug: string) {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            description
          }
        }
      }
    }
  `

  const data = await fetchGraphQL(query, { slug })
  return data.post
}

// Отримання всіх категорій
export async function getCategories() {
  const query = `
    query GetCategories {
      categories {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `

  const data = await fetchGraphQL(query)
  return data.categories.nodes
}

// Отримання постів за категорією
export async function getPostsByCategory(categorySlug: string, page = 1, perPage = 9) {
  const query = `
    query GetPostsByCategory($categorySlug: String!, $first: Int!, $after: String) {
      posts(
        first: $first, 
        after: $after, 
        where: { 
          orderby: { field: DATE, order: DESC },
          categoryName: $categorySlug
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    }
  `

  // Розрахунок курсору для пагінації (аналогічно getPosts)
  let after = null
  if (page > 1) {
    const prevPageData = await fetchGraphQL(query, {
      categorySlug,
      first: perPage,
      after: null,
    })

    if (prevPageData?.posts?.pageInfo?.endCursor) {
      after = prevPageData.posts.pageInfo.endCursor

      for (let i = 2; i < page; i++) {
        const nextPageData = await fetchGraphQL(query, {
          categorySlug,
          first: perPage,
          after,
        })

        if (nextPageData?.posts?.pageInfo?.endCursor) {
          after = nextPageData.posts.pageInfo.endCursor
        } else {
          break
        }
      }
    }
  }

  const data = await fetchGraphQL(query, {
    categorySlug,
    first: perPage,
    after,
  })

  return {
    posts: data.posts.nodes,
    pageInfo: data.posts.pageInfo,
  }
}

// Форматування дати
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

// Очищення HTML від тегів для excerpt
export function stripHtml(html: string) {
  if (!html) return ""
  // Видаляємо HTML теги
  const text = html.replace(/<\/?[^>]+(>|$)/g, "")
  // Видаляємо зайві пробіли
  return text.replace(/\s+/g, " ").trim()
}
