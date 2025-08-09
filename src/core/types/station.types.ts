export interface CreateStationDto {
  ownerId: string
  name: string
  streamUrl: string
  coverImage?: string
  liveInfo?: string
  description?: string
  countryId: string
  genreIds: string[]
  favoritesCount?: number
}

export interface UpdateStationDto {
  ownerId?: string
  name?: string
  streamUrl?: string
  coverImage?: string
  liveInfo?: string
  description?: string
  countryId?: string
  genreIds?: string[]
  favoritesCount?: number
}

export interface ResponseStationDto {
  id: string
  ownerId: string
  slug: string
  name: string
  streamUrl: string
  coverImage?: string
  liveInfo?: string
  description?: string
  countryId: string
  genreIds: string[]
  moderators?: string[]
  favoritesCount: number
  createdAt:
    | {
        _seconds: number
        _nanoseconds: number
      }
    | string
  updatedAt:
    | {
        _seconds: number
        _nanoseconds: number
      }
    | string
}

export interface UpdateFavoritesDto {
  increment: number
}

export interface UpdateFavoritesResponse {
  favoritesCount: number
  message: string
}

export interface StationQueryParams {
  countryId?: string
  genreId?: string
  ownerId?: string
}

export interface TopStationsQueryParams {
  limit?: number
}
