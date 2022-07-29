type Item = {
  id: string
  product: RetailProduct
}

type RetailProduct = {
  name: string
  categories: string[]
  title: string
  description: string
  uri: string
  images: RetailImage[]
}

type RetailImage = {
  uri: string
}

type SearchResult = {
  totalSize?: number
}

export type { Item, SearchResult }