import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/features/settings'
import HeaderNavbar from '@/components/header-navbar'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsLayout,
})

function SettingsLayout() {
  return (
    <>
      <HeaderNavbar />
      <div className='p-4'>
        <Settings />
      </div>
    </>
  )
}