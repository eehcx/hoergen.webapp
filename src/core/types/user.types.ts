export interface CreateUserDto {
  email: string
  password: string
  displayName: string
  photoURL?: string
  role: 'listener' | 'pro' | 'creator' | 'moderator' | 'admin' 
  plan: 'free' | 'pro' | 'creator'
}

export interface UpdateUserDto {
  email?: string
  displayName?: string
  photoURL?: string
  role?: 'listener' | 'pro' | 'creator' | 'moderator' | 'admin' 
  plan?: 'free' | 'pro' | 'creator'
}

export interface UserResponseDto {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: 'listener' | 'pro' | 'creator' | 'moderator' | 'admin' 
  plan: 'free' | 'pro' | 'creator'
  createdAt: string
  updatedAt: string
}

export interface CustomClaimsDto {
  role: 'listener' | 'pro' | 'creator' | 'moderator' | 'admin'
  plan: 'free' | 'pro' | 'creator'
}

export interface UpdateUserFavoritesDto {
  increment: number
}

export interface CreateUserFirebaseDto {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}
