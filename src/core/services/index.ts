// Base service
export { BaseService } from './base.service'

// Feature services
export { GenreService } from './genres'
export { StationService } from './stations'
export { UserService } from './users'
export { EventService } from './events'
export { ChatService } from './chats'
export { ProductService } from './products'
export { CountryService } from './countries'
export { HistoryService } from './history'
export { RadioBrowserService } from './radio-browser'

// Import classes for instances
import { GenreService } from './genres'
import { StationService } from './stations'
import { UserService } from './users'
import { EventService } from './events'
import { ChatService } from './chats'
import { ProductService } from './products'
import { CountryService } from './countries'
import { HistoryService } from './history'
import { RadioBrowserService } from './radio-browser'

// Service instances (ready to use)
export const genreService = GenreService.getInstance()
export const stationService = StationService.getInstance()
export const userService = UserService.getInstance()
export const eventService = EventService.getInstance()
export const chatService = ChatService.getInstance()
export const productService = ProductService.getInstance()
export const countryService = CountryService.getInstance()
export const historyService = HistoryService.getInstance()
export const radioBrowserService = RadioBrowserService.getInstance()
