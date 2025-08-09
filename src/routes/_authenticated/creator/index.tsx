import { createFileRoute } from '@tanstack/react-router'
import Creator from '@/features/creator'
import HeaderNavbar from '@/components/header-navbar'
import { Footer } from '@/components/footer'

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
