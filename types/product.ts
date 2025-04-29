export interface Product {
  id: number
  name: string
  sku: string
  price: string
  status: string
  permalink: string
  categories: Category[]
  brands: Brand[]
  tags: Tag[] // Додаємо теги
  images: Image[]
  attributes: Attribute[]
  stock_status: string
  meta_data: MetaData[]
  description?: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Brand {
  id: number
  name: string
  slug: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Image {
  id: number
  src: string
  alt: string
}

export interface Attribute {
  id: number
  name: string
  options: string[]
}

export interface MetaData {
  key: string
  value: string
}
