export interface Post {
  id: string
  title: string
  slug: string
  date: string
  excerpt: string
  content?: string
  featuredImage?: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
  categories: {
    nodes: Category[]
  }
  author: {
    node: {
      name: string
      description?: string
    }
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  count?: number
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string
}

export interface PostsResponse {
  posts: Post[]
  pageInfo: PageInfo
}
