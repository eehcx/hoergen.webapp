import { useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Helmet } from "@dr.pogodin/react-helmet";
import { createFileRoute } from '@tanstack/react-router'
import HeaderNavbar from '@/components/header-navbar'
import { Footer } from '@/components/footer'
import type { ResponseStationDto } from '@/core/types/station.types'
import { stationService } from '@/core/services'
import Station from '@/features/station'

export const Route = createFileRoute('/_authenticated/s/$stationSlug')({
  component: StationPage,
})

function StationPage() {
  const { stationSlug } = useParams({ strict: false })
  const search = useSearch({ strict: false }) as Partial<ResponseStationDto>
  const [station, setStation] = useState<ResponseStationDto | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (search && search.id) {
      setStation(search as ResponseStationDto)
    } else if (stationSlug) {
      stationService.getStationById(stationSlug)
        .then(setStation)
        .catch(() => setError('No se encontró la estación'))
    } else {
      setError('ID de estación no válido')
    }
  }, [stationSlug, search])

  if (error) {
    return (
      <>
        <HeaderNavbar sticky />
        <div className="p-8 text-center text-red-500">{error}</div>
      </>
    )
  }

  if (!station) {
    return (
      <>
        <HeaderNavbar sticky />
        <div className="p-8 text-center">Cargando información de la estación...</div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{station.name} - Hoergen</title>
        <meta name="description" content={station.description || 'Listen your favorite radio station on Hoergen'} />
        <link rel="canonical" href={`/s/${stationSlug}`} />
      </Helmet>
      <HeaderNavbar sticky />
      <Station station={station} />
      <Footer />
    </>
  )
}