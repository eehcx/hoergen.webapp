import type { ResponseStationDto } from '@/core/types/station.types'

export function normalizeRadioBrowserStation(station: any): ResponseStationDto {
    return {
        id: station.stationuuid,
        ownerId: 'radiobrowser',
        name: station.name,
        streamUrl: station.url_resolved,
        coverImage: station.favicon || undefined,
        liveInfo: undefined,
        description: station.tags || '',
        countryId: station.countrycode || '',
        genreIds: station.tags ? station.tags.split(',').map((tag: string) => tag.trim()) : [],
        favoritesCount: station.clickcount || 0,
        slug: '',
        createdAt: '',
        updatedAt: '',
    }
}
