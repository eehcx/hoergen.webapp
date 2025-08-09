import { createFileRoute, redirect } from '@tanstack/react-router'
import { auth } from '@/core/firebase'
import NewStation from '@/features/station/new'

export const Route = createFileRoute('/_authenticated/s/new/')({
  beforeLoad: async () => {
    // Verificar autenticación
    if (!auth.currentUser) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: '/s/new'
        }
      })
    }

    // Verificar permisos (creator o admin)
    try {
      const tokenResult = await auth.currentUser.getIdTokenResult()
      const userRole = tokenResult.claims?.role as string

      if (!userRole || !['creator', 'admin'].includes(userRole)) {
        throw redirect({
          to: '/403', // Página de acceso denegado
        })
      }
    } catch (error) {
      console.error('Error checking permissions:', error)
      throw redirect({
        to: '/403',
      })
    }
  },
  component: NewStation,
})