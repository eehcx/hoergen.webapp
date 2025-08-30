import { useStaticTranslation } from '@/hooks/useTranslation'
import { LanguageSelectorWithText } from '@/components/language-selector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function SettingsLanguage() {
  const { t, locale, locales, isLoading } = useStaticTranslation()

  // Mostrar un indicador de carga sutil si se están cargando traducciones
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
        </div>
        <div className="h-px bg-border"></div>
        <div className="space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded"></div>
          <div className="h-32 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">{t('settings.language')}</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {t('settings.languageDescription')}
        </p>
      </div>
      
      <Separator className="my-6" />
      
      {/* Current Language Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            {t('settings.currentLanguage')}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {t('settings.currentLanguageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-background border border-border/50">
            <div className="space-y-1">
              <p className="font-semibold text-lg">{locales[locale]}</p>
              <p className="text-sm text-muted-foreground">
                {t('settings.languageCode')}: <code className="px-2 py-1 bg-muted text-xs font-mono">{locale}</code>
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
              {t('settings.active')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Language Selector Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {t('settings.changeLanguage')}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {t('settings.changeLanguageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 border border-border/50">
            <LanguageSelectorWithText />
          </div>
        </CardContent>
      </Card>

      {/* Available Languages Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {t('settings.availableLanguages')}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {t('settings.availableLanguagesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {Object.entries(locales).map(([code, name]) => (
              <div
                key={code}
                className={`flex items-center justify-between p-4 border transition-all duration-200 ${
                  locale === code 
                    ? 'bg-primary/5 border-primary/30 shadow-sm' 
                    : 'bg-background border-border/50 hover:border-border hover:bg-muted/20'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-medium text-base">{name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`settings.languageInfo.${code}`)}
                  </p>
                </div>
                {locale === code && (
                  <Badge variant="default" className="px-2 py-1 text-xs font-medium">
                    {t('settings.current')}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language Preferences Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            {t('settings.languagePreferences')}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {t('settings.languagePreferencesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/50">
            <div className="space-y-1">
              <p className="font-medium">{t('settings.autoDetect')}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('settings.autoDetectDescription')}
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
              {t('settings.enabled')}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/50">
            <div className="space-y-1">
              <p className="font-medium">{t('settings.rememberChoice')}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('settings.rememberChoiceDescription')}
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
              {t('settings.enabled')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
