import { createFileRoute } from '@tanstack/react-router'
import Creator from '@/presentation/features/creator'
import HeaderNavbar from '@/presentation/components/header-navbar'
import { Footer } from '@/presentation/components/footer'

export const Route = createFileRoute('/_authenticated/creator/')({
  component: CreatorPage,
})

function CreatorPage() {
  return (
    <>
      <HeaderNavbar />
      <Creator />
      <Footer />
    </>
  )
}
