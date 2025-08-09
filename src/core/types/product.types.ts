import { UserRole } from "./user.types"

export interface ProductMetadata {
  accessLevel: number
  createdFrom: string
  features: string
}

export interface PriceMetadata {
  role: UserRole
  accessLevel: number
}

export interface Recurring {
  interval_count: number
  usage_type: string
  meter: any
  interval: string
  trial_period_days: number | null
}

export interface CreateProductDto {
  name: string
  description: string
  images?: string[]
  metadata: ProductMetadata
  status: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  images?: string[]
  metadata?: ProductMetadata
  status?: string
}

export interface CreatePriceDto {
  type: string
  currency: string
  unitAmount: number
  recurringInterval: string
  intervalCount: number
  metadata: PriceMetadata
}

export interface UpdatePriceMetadataDto {
  role?: UserRole
  accessLevel?: number
}

export interface ProductQueryParams {
  status?: string
  accessLevel?: number
  withPrices?: boolean
}

export interface PriceResponseDto {
  id: string
  tax_behavior: string
  product: string
  tiers: any[]
  metadata: PriceMetadata
  active: boolean
  description: string
  billing_scheme: string
  trial_period_days: number | null
  transform_quantity: any
  tiers_mode: any
  stripe_metadata_role: UserRole
  currency: string
  stripe_metadata_access_level: string
  unit_amount: number
  interval_count: number
  recurring: Recurring
  interval: string
  type: string
}

export interface ProductResponseDto {
  stripe_metadata_features: string
  images: string[]
  tax_code: string | null
  role: UserRole | any
  name: string
  active: boolean
  description: string
  stripe_metadata_access_level: string
  stripe_metadata_created_from: string
  id: string
}

export interface Price {
  type: string
  currency: string
  unitAmount: number
  recurringInterval: string
  intervalCount: number
  metadata: PriceMetadata
}

export interface Product {
  name: string
  description: string
  images: string[]
  metadata: ProductMetadata
  status: string
}

export interface ProductWithPrice {
  product: CreateProductDto
  price: CreatePriceDto
}

export interface ProductWithPriceResponse extends ProductResponseDto {
  prices?: PriceResponseDto[]
}