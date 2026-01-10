import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from "@dr.pogodin/react-helmet"
import Listener from "@/presentation/features/listener"
import { useAuth, usePermissions } from "@/presentation/hooks"
import { Button } from "@/presentation/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/presentation/components/ui/alert"
import { useStaticTranslation } from "@/presentation/hooks/useTranslation"

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
})

function HomePage() {
  const { claims, isLoading } = useAuth()
  const { hasRole, hasAnyRole } = usePermissions()
  const { t } = useStaticTranslation()

  const isFree = claims?.plan === "free"

  return (
    <>
      <Helmet>
        <title>{t('home.title')}</title>
      </Helmet>

      <div className="container p-6">
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : isFree ? (
            <Alert className="mb-4 rounded-xs">
              <AlertTitle>{t('home.openFrequencies')}</AlertTitle>
              <AlertDescription>
                {t('home.openFrequenciesDescription')} <br />
                <Button asChild className="mt-2 rounded-none bg-[#26E056] hover:bg-[#1DBB4D]">
                  {/*{t('home.subscribeNow')}*/}
                  <a href="/worldwide" className="text-zinc-800">{t('home.browseNodes')}</a>
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {hasAnyRole(['listener', 'pro']) && (
                <>
                  <h1 className="text-3xl font-bold tracking-tight">{t('home.nowPlaying')}</h1>
                  <p className="text-muted-foreground">
                    {t('home.discoverStations')}
                  </p>
                </>
              )}
              {hasRole('creator') && (
                <>
                  <h1 className="text-3xl font-bold tracking-tight">{t('home.nowBroadcasting')}</h1>
                  <p className="text-muted-foreground">
                    {t('home.shapeStationCulture')}
                  </p>
                </>
              )}
            </>
          )}
        </div>
        <Listener />
      </div>
    </>
  )
}
