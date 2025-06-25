export interface CreateGenreDto {
  name: string
  description: string
  canonicalName: string
  aliases: string[]
  tags: string[]
  searchTerms: string[]
}

export interface UpdateGenreDto {
  name?: string
  description?: string
  canonicalName?: string
  aliases?: string[]
  tags?: string[]
  searchTerms?: string[]
}

export interface GenreResponseDto {
  id: string
  name: string
  description: string
  canonicalName: string
  aliases: string[]
  tags: string[]
  searchTerms: string[]
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  message: string
  data?: T
}
