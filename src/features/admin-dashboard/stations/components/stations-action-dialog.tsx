import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useStationsContext } from '../context/stations-context'
import { StationService } from '@/core/services/stations/station.service'
import type { CreateStationDto, UpdateStationDto } from '@/core/types/station.types'
import { useGenres } from '@/features/admin-dashboard/genres/hooks'
import { useCountries } from '@/features/admin-dashboard/countries/hooks'
import { useUsers } from '@/features/admin-dashboard/users/hooks'
import { SelectDropdown } from '@/components/select-dropdown'
import { MultiSelect } from '@/components/ui/multi-select'

export function StationsActionDialog() {
  const { open, setOpen, currentRow } = useStationsContext()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const isEditMode = open === 'edit' && currentRow
  const isOpen = open === 'add' || open === 'edit'

  const [formData, setFormData] = useState({
    name: '',
    streamUrl: '',
    coverImage: '',
    liveInfo: '',
    description: '',
    countryId: '',
    genreIds: '',
    ownerId: '',
  })

  const [genreIds, setGenreIds] = useState<string[]>([])

  useEffect(() => {
    if (isEditMode && currentRow) {
      setFormData({
        name: currentRow.name || '',
        streamUrl: currentRow.streamUrl || '',
        coverImage: currentRow.coverImage || '',
        liveInfo: currentRow.liveInfo || '',
        description: currentRow.description || '',
        countryId: currentRow.countryId || '',
        genreIds: '', // lo maneja genreIds state
        ownerId: currentRow.ownerId || '',
      })
      setGenreIds(currentRow.genreIds || [])
    } else {
      resetForm()
      setGenreIds([])
    }
  }, [isEditMode, currentRow])

  const createMutation = useMutation({
    mutationFn: (data: CreateStationDto) => StationService.getInstance().createStation(data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationDto }) =>
      StationService.getInstance().updateStation(id, data),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const stationData = {
        ...formData,
        genreIds: genreIds,
        favoritesCount: currentRow?.favoritesCount || 0,
      }

      if (isEditMode && currentRow) {
        await updateMutation.mutateAsync({
          id: currentRow.id,
          data: stationData as UpdateStationDto,
        })
      } else {
        await createMutation.mutateAsync(stationData as CreateStationDto)
      }

      queryClient.invalidateQueries({ queryKey: ['stations'] })
      setOpen(null)
      resetForm()
    } catch (error) {
      console.error('Error saving station:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      streamUrl: '',
      coverImage: '',
      liveInfo: '',
      description: '',
      countryId: '',
      genreIds: '',
      ownerId: '',
    })
    setGenreIds([])
  }

  const handleClose = () => {
    setOpen(null)
    resetForm()
  }

  const { data: genres = [] } = useGenres()
  const { data: countries = [] } = useCountries()
  const { data: users = [] } = useUsers()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Station' : 'Add New Station'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the station information below.'
              : 'Create a new radio station by filling out the form below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Station Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Enter station name'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ownerId'>Owner *</Label>
              <SelectDropdown
                value={formData.ownerId}
                onValueChange={val => setFormData({ ...formData, ownerId: val })}
                items={users.filter(u => ['creator', 'admin'].includes(u.claims.role)).map(u => ({ value: u.id, label: u.displayName || u.email }))}
                placeholder='Select owner'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='streamUrl'>Stream URL *</Label>
            <Input
              id='streamUrl'
              type='url'
              value={formData.streamUrl}
              onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
              placeholder='https://stream.example.com/radio'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='coverImage'>Cover Image URL</Label>
            <Input
              id='coverImage'
              type='url'
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder='https://example.com/image.jpg'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='countryId'>Country *</Label>
              <SelectDropdown
                value={formData.countryId}
                onValueChange={val => setFormData({ ...formData, countryId: val })}
                items={countries.map(c => ({ value: c.id, label: c.name }))}
                placeholder='Select country'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='genreIds'>Genres</Label>
              <MultiSelect
                options={genres.map(g => ({ value: g.id, label: g.name }))}
                value={genreIds}
                onChange={setGenreIds}
                placeholder='Select genres'
                label={undefined}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='liveInfo'>Live Info</Label>
            <Input
              id='liveInfo'
              value={formData.liveInfo}
              onChange={(e) => setFormData({ ...formData, liveInfo: e.target.value })}
              placeholder='Currently playing...'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder='Station description...'
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
