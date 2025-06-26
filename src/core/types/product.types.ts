export interface CreateProductDto {
  name: string
  description: string
  imageUrl?: string
  priceAmount: number
  currency: string
  recurringInterval: string
  accessLevel: string
  createdFrom: string
  features: string[]
  subscriptionType: string
  type: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  imageUrl?: string
  priceAmount?: number
  currency?: string
  recurringInterval?: string
  accessLevel?: string
  createdFrom?: string
  features?: string[]
  subscriptionType?: string
  type?: string
}

export interface ProductResponseDto {
  id: string
  name: string
  description: string
  imageUrl?: string
  priceAmount: number
  currency: string
  recurringInterval: string
  accessLevel: string
  createdFrom: string
  features: string[]
  subscriptionType: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface ProductQueryParams {
  type?: string
  subscriptionType?: string
}

// Price interface for the new prices endpoint
export interface ProductPriceDto {
  id: string
  productId: string
  amount: number
  currency: string
  interval?: string
  intervalCount?: number
  type: 'recurring' | 'one_time'
  active: boolean
  createdAt: string
  updatedAt: string
}
