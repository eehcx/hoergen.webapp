export type UserRole = 'listener' | 'pro' | 'creator' | 'moderator' | 'admin'
export type PlanType = 'free' | 'pro' | 'creator'
export type UserStatus = 'active' | 'inactive' | 'banned'

// API DTO: User creation
export interface CreateUserDto {
  email: string
  password: string
  displayName: string
  photoURL?: string
  role: UserRole
  plan: PlanType
}

// Firebase DTO: User creation
export interface CreateUserFirebaseDto {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

// API DTO: User update
export interface UpdateUserDto {
  //email?: string
  displayName?: string
  photoURL?: string
  role?: UserRole
  plan?: PlanType
  status?: UserStatus
  favorites?: string[]
}

// API Response: Generic response structure
export interface UserResponseDto {
  id: string
  email: string
  displayName: string
  photoURL?: string
  claims: {
    role: UserRole
    plan: PlanType
  }
  status: UserStatus
  favorites: string[]
  createdAt:
    | {
        _seconds: number
        _nanoseconds: number
      }
    | string
}

export interface CustomClaimsDto {
  role?: UserRole
  plan?: PlanType
}

export interface UpdateUserFavoritesDto {
  favorites: string[]
}
