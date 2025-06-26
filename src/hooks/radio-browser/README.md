# Radio Browser Hooks

This directory contains TanStack Query hooks for interacting with the Radio Browser API. These hooks provide a clean, type-safe interface for fetching radio station data with built-in caching, error handling, and loading states.

## Available Hooks

### `useRadioBrowserStations`
Main hook for fetching radio stations with advanced filtering and validation.

```typescript
import { useRadioBrowserStations } from '@/hooks/radio-browser'

const { stations, isLoading, error, refetch } = useRadioBrowserStations({
  limit: 20,
  strategy: 'top-voted', // 'top-voted' | 'most-clicked' | 'random-genre'
  genreFilter: ['rock', 'pop']
})
```

**Features:**
- Advanced station validation (stream URL, favicon, bitrate)
- Multiple fetching strategies
- Genre filtering
- Automatic retry on failures
- Built-in error handling

### `useTopRadioStations`
Fetch top-voted radio stations.

```typescript
import { useTopRadioStations } from '@/hooks/radio-browser'

const { data: stations, isLoading, error } = useTopRadioStations(10)
```

### `usePopularRadioStations`
Fetch most-clicked radio stations.

```typescript
import { usePopularRadioStations } from '@/hooks/radio-browser'

const { data: stations, isLoading, error } = usePopularRadioStations(10)
```

### `useRadioStationsByTag`
Fetch stations by tag/genre.

```typescript
import { useRadioStationsByTag } from '@/hooks/radio-browser'

const { data: stations, isLoading, error } = useRadioStationsByTag('rock', 15)
```

### `useRadioStationsByCountry`
Fetch stations by country.

```typescript
import { useRadioStationsByCountry } from '@/hooks/radio-browser'

const { data: stations, isLoading, error } = useRadioStationsByCountry('US', 20)
```

### `useSearchRadioStations`
Search stations by name or other criteria.

```typescript
import { useSearchRadioStations } from '@/hooks/radio-browser'

const { data: stations, isLoading, error } = useSearchRadioStations('BBC', 10)
```

### `useRecentRadioStations`
Fetch recently added stations.

```typescript
import { useRecentRadioStations } from '@/hooks/radio-browser'

const { data: stations, isLoading, error } = useRecentRadioStations(15)
```

## Configuration

All hooks are configured with sensible defaults:
- **Stale Time**: 5-10 minutes (depending on hook)
- **Garbage Collection Time**: 10-30 minutes
- **Retry**: 2 attempts on failure
- **Refetch on Window Focus**: Disabled for better UX

## Validation

The main `useRadioBrowserStations` hook includes comprehensive validation:
- Stream URL accessibility
- Favicon image availability
- Minimum bitrate requirements
- Proper URL formatting
- Non-empty station names

Stations that fail validation are automatically filtered out.

## Types

```typescript
interface RadioBrowserStationsParams {
  limit?: number
  strategy?: 'top-voted' | 'most-clicked' | 'random-genre'
  genreFilter?: string[]
}

interface RadioBrowserStationsResult {
  stations: RadioBrowserStation[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
```

## Error Handling

All hooks handle errors gracefully and provide error states through the returned `error` property. Network failures are automatically retried, and invalid stations are filtered out rather than causing errors.
