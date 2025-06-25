export interface CreateProductDto {
  name: string
  description: string
  imageUrl?: string
  priceAmount: number
  currency: string
  recurringInterval: 'month' | 'year'
  accessLevel: number
  createdFrom: string
  features: string
  subscriptionType: 'free' | 'premium' | 'business'
  type: 'subscription' | 'one_time'
}

export interface UpdateProductDto {
  name?: string
  description?: string
  imageUrl?: string
  priceAmount?: number
  currency?: string
  recurringInterval?: 'month' | 'year'
  accessLevel?: number
  createdFrom?: string
  features?: string
  subscriptionType?: 'free' | 'premium' | 'business'
  type?: 'subscription' | 'one_time'
}

export interface ProductResponseDto {
  id: string
  name: string
  description: string
  imageUrl?: string
  priceAmount: number
  currency: string
  recurringInterval: 'month' | 'year'
  accessLevel: number
  createdFrom: string
  features: string
  subscriptionType: 'free' | 'premium' | 'business'
  type: 'subscription' | 'one_time'
  createdAt: string
  updatedAt: string
}

export interface ProductQueryParams {
  type?: 'subscription' | 'one_time'
}
