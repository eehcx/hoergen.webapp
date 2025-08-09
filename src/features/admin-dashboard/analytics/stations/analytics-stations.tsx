import { useGeneralStations, useTopStations } from './hooks/useStations'
import { Skeleton } from '@/components/ui/skeleton'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { useEffect, useMemo, useState } from 'react'
import { CountryService } from '@/core/services/countries/country.service'

// Helper para mostrar bandera por ISO code
function getFlagEmoji(countryCode: string) {
    if (!countryCode) return ''
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

// Simulación de servicio de géneros (reemplaza por tu fetch real)
const GENRE_MAP: Record<string, string> = {
    '7YjxvQlwD4raKuxQDv7f': 'Techno',
    'mpAv3aIE8jZBSRKIvlFW': 'House',
    'iAlbEGhhQcYX6gxsvqkv': 'Trance',
    'zdaEb2MFRqAoOq1u38Om': 'Drum & Bass',
    'C9gvYuhwM0XKiSlrST8i': 'Dubstep',
    'tH1Y1miwrU2AicXKk8ab': 'Electro',
    'd4NzkrQ0bzrjPJSyuwkh': 'Ambient',
    'uWaDvAHGAIWN9d4QIEfQ': 'Minimal',
    'MGei6sBLBold5rxVoi6u': 'Hardcore',
    'jtcRW4hKyQLPhD6gH9BT': 'Breakbeat',
    'RnCHFifvL1Q1a036thAe': 'Progressive',
    'TUFtLxVkNAxsklnjM4ue': 'Tech House',
    'qadK19WZnRdGoQjF6bdn': 'Deep House',
    'eBhBIkvbFcHZRAZz1sBa': 'Chillout',
    '5axOs3Y4dfr9rHgZdnOF': 'Experimental'
}

const COLORS = [
    '#34d399', '#4F8AF7', '#A0AEC0', '#fbbf24', '#a78bfa', '#f87171', '#f472b6', '#60a5fa'
]

interface TopStation {
    id: string
    name: string
    countryId: string
    favoritesCount: number
}
interface StationByCountry {
    countryId: string
    count: number
}
interface StationByGenre {
    genreId: string
    count: number
}

export function AnalyticsStations() {
    const { data: general, isLoading: loadingGeneral } = useGeneralStations()
    const { data: topStations, isLoading: loadingTop } = useTopStations(5)

    // Estado para los nombres de país
    const [, setCountryNames] = useState<Record<string, string>>({}) //countryNames

    // Obtener nombres de países por countryId
    useEffect(() => {
        async function fetchCountryNames() {
            if (!general?.stationsByCountry) return
            const service = CountryService.getInstance()
            const ids: string[] = general.stationsByCountry.map((c: StationByCountry) => c.countryId)
            const promises: Promise<{ id: string; name: string }>[] = ids.map((id: string) =>
                service.getCountryByIsoCode(id).then(
                    (country: { name?: string } | null) => ({ id, name: country?.name || id }),
                    () => ({ id, name: id })
                )
            )
            const results = await Promise.all(promises)
            const namesMap: Record<string, string> = {}
            results.forEach(({ id, name }) => {
                namesMap[id] = name
            })
            setCountryNames(namesMap)
        }
        fetchCountryNames()
    }, [general?.stationsByCountry])

    // PieChart: estaciones por país (solo bandera)
    const countryData = useMemo(() => {
        if (!general?.stationsByCountry) return []
        return general.stationsByCountry.map((c: StationByCountry) => ({
            name: getFlagEmoji(c.countryId),
            value: c.count,
        }))
    }, [general?.stationsByCountry])

    // BarChart: estaciones por género (nombre real)
    const genreData = useMemo(() => {
        if (!general?.stationsByGenre) return []
        return general.stationsByGenre.map((g: StationByGenre) => ({
            name: GENRE_MAP[g.genreId] || g.genreId,
            value: g.count,
        }))
    }, [general?.stationsByGenre])

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* PieChart: Estaciones por país */}
            <div className="bg-background rounded-md p-4 shadow">
                <h3 className="font-semibold mb-2">Stations by Country</h3>
                <ResponsiveContainer width="100%" height={250}>
                    {loadingGeneral ? (
                        <Skeleton className="w-full h-40 rounded-full" />
                    ) : (
                        <PieChart>
                            <Pie
                                data={countryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {countryData.map((_: { name: string; value: number }, idx: number) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* BarChart: Estaciones por género */}
            <div className="bg-background rounded-md p-4 shadow">
                <h3 className="font-semibold mb-2">Stations by Genre</h3>
                <ResponsiveContainer width="100%" height={250}>
                    {loadingGeneral ? (
                        <Skeleton className="w-full h-40 rounded-md" />
                    ) : (
                        <BarChart data={genreData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                angle={-30}
                                textAnchor="end"
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {genreData.map((_: { name: string; value: number }, idx: number) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Top Stations List */}
            <div className="lg:col-span-2 bg-background rounded-md p-4 shadow">
                <h3 className="font-semibold mb-2">Top Stations</h3>
                {loadingTop ? (
                    <Skeleton className="w-full h-20 rounded-md" />
                ) : (
                    <div className="divide-y divide-border">
                        {topStations?.map((station: TopStation) => (
                            <div key={station.id} className="flex items-center py-2 gap-4">
                                <span className="font-medium">{station.name}</span>
                                <span className="ml-auto flex items-center gap-2">
                                    <span>{getFlagEmoji(station.countryId)}</span>
                                    <span className="text-xs text-yellow-500">★ {station.favoritesCount}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}