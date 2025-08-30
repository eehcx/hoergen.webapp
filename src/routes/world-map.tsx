import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from "@dr.pogodin/react-helmet"
import WorldMap from '@/features/world-map'

export const Route = createFileRoute('/world-map')({
  component: WorldMapPage,
})

function WorldMapPage() {
  return (
    <>
      <Helmet>
        <title>Globo Terrestre de Estaciones · Hoergen</title>
        <meta 
          name="description" 
          content="Explora todas las estaciones de radio del mundo en nuestro globo terráqueo 3D interactivo"
        />
        <meta 
          property="og:type"        
          content="website" 
        />
        <meta 
          property="og:title"       
          content="Globo Terrestre de Estaciones · Hoergen" 
        />
        <meta 
          property="og:description" 
          content="Explora todas las estaciones de radio del mundo en nuestro globo terráqueo 3D interactivo"
        />
        <link rel="canonical" href="/world-map" />
      </Helmet>
      <WorldMap />
    </>
  )
}
