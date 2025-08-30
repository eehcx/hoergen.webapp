import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import type { ResponseStationDto } from '@/core/types/station.types'
import { useAuth } from '@/hooks'
import { slugify } from '@/utils'
import { usePermissions } from '@/hooks/auth/usePermissions'
import { useStaticTranslation } from '@/hooks/useTranslation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  EditStationForm,
  StationActionsMenu,
  ManageModeratorsModal,
} from './components'
import {
  useGenreNames,
  useStationEvents,
  useCreatorStations,
  useEditStation,
  useDeleteStation,
} from './hooks'

export default function Creator() {
  const { t } = useStaticTranslation()
  const { user } = useAuth()
  const { hasRole } = usePermissions()
  const creatorId = user?.uid ?? ''
  const { data: stations, isLoading } = useCreatorStations(creatorId)
  const [selectedStationId, setSelectedStationId] = useState<
    string | undefined
  >()
  const [editStation, setEditStation] = useState<any>(null)
  const [deleteStation, setDeleteStation] = useState<any>(null)
  const [manageModeratorsStation, setManageModeratorsStation] =
    useState<any>(null)
  const navigate = useNavigate()

  // Eventos de la estación seleccionada o en hover
  const { data: events, isLoading: loadingEvents } =
    useStationEvents(selectedStationId)
  // Nombres de géneros usando el hook local
  const genreNamesMap = useGenreNames(stations)
  // Helper para obtener los nombres de géneros por estación
  const getGenreNamesForStation = (station: ResponseStationDto) => {
    if (!genreNamesMap || !station) return []
    return station.genreIds.map((id: string) => genreNamesMap[id] || id)
  }

  // Hooks para editar/eliminar
  const editMutation = useEditStation(
    (station) => {
      setEditStation(null)
      console.log('Station updated successfully:', station)
    },
    (error) => {
      console.error('Failed to update station:', error)
    }
  )

  const deleteMutation = useDeleteStation(
    (stationId) => {
      setDeleteStation(null)
      console.log('Station deleted successfully:', stationId)
    },
    (error) => {
      console.error('Failed to delete station:', error)
    }
  )

  // Navegación
  const handleStationClick = (station: any) => {
    navigate({
      to: '/$slugName',
      params: { slugName: station.slug || slugify(station.name) },
      //search: station,
    })
  }

  return (
    <div className='mx-16 flex max-w-[1600px] items-start gap-12 px-4 pt-2 pb-32'>
      <aside className='rounded-none' style={{ marginTop: '2.5rem' }}>
        {/* Admin Panel Button - Solo para administradores */}
        {hasRole('admin') && (
          <div className='mb-6 w-56 max-w-xs min-w-56'>
            <Button
              variant='ghost'
              className='justify-start gap-2'
              onClick={() => navigate({ to: '/admin' })}
            >
              <IconArrowLeft size={16} />
              {t('creator.backToDashboard')}
            </Button>
          </div>
        )}

        <div className='mb-10 w-56 max-w-xs min-w-56'>
          <div className='bg-card border-border flex flex-col items-start gap-2 rounded-none border p-3'>
            <span className='text-base font-semibold'>
              {t('creator.yourStations')}
            </span>
            <span className='text-sm text-muted-foreground'>
              {t('creator.stationsDescription')}
            </span>
            <a
              href='https://www.azuracast.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary mt-2 text-sm font-medium underline'
            >
              {t('creator.goToAzuraCast')}
            </a>
          </div>
        </div>

        <h3 className='mb-2 font-semibold'>{t('creator.events')}</h3>
        <div className='border-border h-fit w-56 max-w-xs min-w-48 border-r p-4 text-sm'>
          {loadingEvents ? (
            <div className='space-y-2'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-6 w-full' />
              ))}
            </div>
          ) : events?.length ? (
            <ul className='space-y-2'>
              {events.map((event) => (
                <li key={event.id} className='border-b pb-2 last:border-none'>
                  <div className='font-medium'>{event.title}</div>
                  <div className='text-muted-foreground text-xs'>
                    {event.description}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='text-muted-foreground'>
              {t('creator.noEvents')}
            </div>
          )}
        </div>
      </aside>

      <main className='max-w-5xl flex-1'>
        <h1 className='mt-10 mb-6 text-3xl font-bold'>{t('creator.radioStations')}</h1>
        <div className='overflow-x-auto'>
          <table className='w-full border-separate border-spacing-y-2 text-sm'>
            <thead>
              <tr>
                <th className='py-2 text-left font-semibold'>{t('creator.cover')}</th>
                <th className='py-2 text-left font-semibold'>{t('creator.name')}</th>
                <th className='py-2 text-left font-semibold'>{t('creator.genres')}</th>
                <th className='py-2 text-left font-semibold'>{t('creator.favorites')}</th>
                <th className='py-2 text-left font-semibold'>{t('creator.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='bg-muted/10'>
                    <td>
                      <Skeleton className='size-8 rounded-none' />
                    </td>
                    <td>
                      <Skeleton className='h-4 w-32 rounded-none' />
                    </td>
                    <td>
                      <Skeleton className='h-4 w-24 rounded-none' />
                    </td>
                    <td>
                      <Skeleton className='h-4 w-12 rounded-none' />
                    </td>
                    <td>
                      <Skeleton className='h-8 w-8 rounded-none' />
                    </td>
                  </tr>
                ))
              ) : stations?.length ? (
                stations.map((station) => {
                  const genreNames: string[] = getGenreNamesForStation(station)
                  return (
                    <tr
                      key={station.id}
                      className='hover:bg-muted/20 cursor-pointer transition'
                      onMouseEnter={() => setSelectedStationId(station.id)}
                      onMouseLeave={() => setSelectedStationId(undefined)}
                    >
                      <td onClick={() => handleStationClick(station)}>
                        <Avatar className='size-8'>
                          {station.coverImage ? (
                            <AvatarImage
                              src={station.coverImage}
                              alt={station.name}
                            />
                          ) : (
                            <AvatarFallback>{station.name[0]}</AvatarFallback>
                          )}
                        </Avatar>
                      </td>
                      <td
                        onClick={() => handleStationClick(station)}
                        className='font-medium'
                      >
                        {station.name}
                      </td>
                      <td>
                        <div className='flex flex-wrap gap-1'>
                          {genreNames.length === 0 ? (
                            <Skeleton className='h-4 w-24 rounded-none' />
                          ) : (
                            genreNames.map((name: string, idx2: number) => (
                              <Badge
                                key={idx2}
                                variant='outline'
                                className='rounded-none text-xs'
                              >
                                {name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </td>
                      <td>{station.favoritesCount}</td>
                      <td>
                        <StationActionsMenu
                          station={station}
                          onEdit={setEditStation}
                          onDelete={setDeleteStation}
                          onManageModerators={setManageModeratorsStation}
                        />
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className='text-muted-foreground py-12 text-center'
                  >
                    You have not created any stations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Edit Dialog */}
        <Dialog
          open={!!editStation}
          onOpenChange={(open) => !open && setEditStation(null)}
        >
          <DialogContent className='max-w-2xl'>
            {editStation && (
              <EditStationForm
                station={editStation}
                onSubmit={(data) => {
                  editMutation.mutate({
                    id: editStation.id,
                    data,
                  })
                }}
                onCancel={() => setEditStation(null)}
                isLoading={editMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
        {/* Delete Dialog */}
        <Dialog
          open={!!deleteStation}
          onOpenChange={(open) => !open && setDeleteStation(null)}
        >
          <DialogContent>
            <div className='mb-4 flex items-center gap-4'>
              <div className='bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full'>
                <svg
                  className='text-destructive h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
                  />
                </svg>
              </div>
              <div>
                <h2 className='text-destructive text-lg font-bold'>
                  Delete Station
                </h2>
                <p className='text-muted-foreground text-sm'>
                  This action cannot be undone
                </p>
              </div>
            </div>
            <div className='mb-6'>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>"{deleteStation?.name}"</span>?{' '}
              This will permanently remove the station and all its associated
              data.
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setDeleteStation(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() => deleteMutation.mutate(deleteStation?.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Station'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Moderators Dialog */}
        {manageModeratorsStation && (
          <ManageModeratorsModal
            station={manageModeratorsStation}
            open={!!manageModeratorsStation}
            onOpenChange={(open) => !open && setManageModeratorsStation(null)}
          />
        )}
      </main>
    </div>
  )
}
