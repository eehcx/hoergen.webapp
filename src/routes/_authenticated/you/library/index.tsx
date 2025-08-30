import { createFileRoute } from '@tanstack/react-router'
import History from '@/features/listener/history';
import Favorites from '@/features/listener/favorites';
import { Helmet } from "@dr.pogodin/react-helmet";
import HeaderNavbar from '@/components/header-navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import React from 'react';
import { Footer } from '@/components/footer';
import { useStaticTranslation } from '@/hooks/useTranslation';

export const Route = createFileRoute('/_authenticated/you/library/')({
  component: LibraryPage
})

function LibraryPage() {
  const { t } = useStaticTranslation();
  const [tabValue, setTabValue] = React.useState<'favorites' | 'history'>('favorites');

  return (
    <>
      <Helmet>
        <title>{t('library.pageTitle')}</title>
        <meta
          name="description"
          content={t('library.pageDescription')}
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <HeaderNavbar sticky />

        <main className="container max-w-7xl mx-auto flex-1 px-4 py-12 space-y-10">
          {/* Hero Section */}
          <section className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {t('library.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t('library.description')}
            </p>
          </section>

          {/* Tabs for Library Sections */}
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value as 'favorites' | 'history')}
            className="w-full"
          >
            <TabsList className="mb-6 rounded-[3px]">
              <TabsTrigger value="favorites" className="flex items-center gap-2 rounded-[3px]">
                {t('library.favorites')}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 rounded-[3px]">
                {t('library.history')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites">
              <Favorites />
            </TabsContent>
            <TabsContent value="history">
              <History />
            </TabsContent>
          </Tabs>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}