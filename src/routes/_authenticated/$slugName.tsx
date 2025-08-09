import { 
  createFileRoute, 
  useParams, 
  //useNavigate 
} from '@tanstack/react-router'
import { Helmet } from "@dr.pogodin/react-helmet";
import HeaderNavbar from '@/components/header-navbar'
import { Footer } from '@/components/footer'
import { Skeleton } from '@/components/ui/skeleton';
import { useStationBySlug } from '@/features/station/hooks';
import Station from '@/features/station'

export const Route = createFileRoute('/_authenticated/$slugName')({
  component: StationPage,
})


function StationPage() {
  const { slugName } = useParams({ strict: false })
  //const navigate = useNavigate()
  const { data: station, isLoading } = useStationBySlug(slugName ?? '')


  if (isLoading) {
    return (
      <>
        <HeaderNavbar />
        <div className="max-w-screen grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pt-8 pb-32">
        {/* Columna principal: eventos + header + info */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Eventos Marquee/Slider arriba del header */}
          <Skeleton className="h-14 w-full rounded mb-2" />
          {/* Station Header + Info */}
          <Skeleton className="h-56 w-full rounded mb-8" />
          <Skeleton className="h-24 w-full rounded" />
        </div>
        {/* Chat estilo Twitch a la derecha */}
        <aside className="bg-card flex h-[540px] max-h-[90vh] flex-col rounded-xs border shadow-md lg:col-span-1">
          <div className="flex items-center justify-between border-b border-zinc-200 p-2.5 dark:border-zinc-800">
            <Skeleton className="h-6 w-32 rounded" />
          </div>
          <div className="flex-1 p-4">
            <Skeleton className="h-full w-full rounded" />
          </div>
          <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </aside>
      </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{station.name} · Hoergen</title>
        <meta 
          name="description" 
          content={station.description 
            || 'Listen your favorite radio station on Hoergen'
          } 
        />
        <meta 
          property="og:type"        
          content="website" 
        />
        <meta 
          property="og:title"       
          content={`Listen ${station.name} on Hoergen`} 
        />
        <meta 
          property="og:image"       
          content={station.coverImage} 
        />
        <link rel="canonical" href={`/${slugName}`} />
      </Helmet>
      <HeaderNavbar sticky />
      <Station station={station} />
      <Footer />
    </>
  )
}