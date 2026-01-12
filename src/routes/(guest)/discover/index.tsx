import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from "@dr.pogodin/react-helmet"
import { useStaticTranslation } from "@/presentation/hooks/useTranslation"
import Discover from '@/presentation/features/discover'

import { 
  Button 
} from "@/presentation/components/ui/button"
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "@/presentation/components/ui/alert"

export const Route = createFileRoute('/(guest)/discover/')({
  component: DiscoverPage,
})

function DiscoverPage() {
  const { t } = useStaticTranslation()
  return (
    <>
      <Helmet>
        <title>{t('home.title')}</title>
      </Helmet>

      <div className="container p-6">
        <div className="space-y-2">
          <Alert className="mb-4 rounded-xs">
              <AlertTitle>{t('discover.openFrequencies')}</AlertTitle>
              <AlertDescription>
                {t('discover.openFrequenciesDescription')} <br />
                <Button asChild className="mt-2 rounded-none bg-[#26E056] hover:bg-[#1DBB4D]">
                  <a href="/worldwide" className="text-zinc-800">{t('discover.browseNodes')}</a>
                </Button>
              </AlertDescription>
            </Alert>
        </div>
        <Discover />
      </div>
    </>
  )
}
