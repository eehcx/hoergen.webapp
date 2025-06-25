export interface CreateUserDto {
  email: string
  password: string
  displayName: string
  photoURL?: string
  role: 'user' | 'admin' | 'moderator'
  plan: 'free' | 'premium' | 'business'
}

export interface UpdateUserDto {
  email?: string
  displayName?: string
  photoURL?: string
  role?: 'user' | 'admin' | 'moderator'
  plan?: 'free' | 'premium' | 'business'
}

export interface UserResponseDto {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: 'user' | 'admin' | 'moderator'
  plan: 'free' | 'premium' | 'business'
  createdAt: string
  updatedAt: string
}

export interface UpdateUserFavoritesDto {
  increment: number
}
