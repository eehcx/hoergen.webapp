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
//import { Textarea } from '@/components/ui/textarea'
import { useCountriesContext } from '../context/countries-context'
import { CountryService } from '@/core/services/countries/country.service'
import type { CreateCountryDto } from '@/core/types/country.types'

export function CountriesActionDialog() {
  const { open, setOpen, currentRow } = useCountriesContext()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const isEditMode = open === 'edit' && currentRow
  const isOpen = open === 'add' || open === 'edit'

  const [formData, setFormData] = useState({
    isoCode: '',
    name: '',
    localName: '',
    continent: '',
    languages: '',
    dialingCode: '',
    capital: '',
    currency: '',
    stationCount: 0,
    popularStations: '',
    searchTerms: '',
  })

  useEffect(() => {
    if (isEditMode && currentRow) {
      setFormData({
        isoCode: currentRow.isoCode || '',
        name: currentRow.name || '',
        localName: currentRow.localName || '',
        continent: currentRow.continent || '',
        languages: currentRow.languages?.join(', ') || '',
        dialingCode: currentRow.dialingCode || '',
        capital: currentRow.capital || '',
        currency: currentRow.currency || '',
        stationCount: currentRow.stationCount || 0,
        popularStations: currentRow.popularStations?.join(', ') || '',
        searchTerms: currentRow.searchTerms?.join(', ') || '',
      })
    } else {
      resetForm()
    }
  }, [isEditMode, currentRow])

  const createMutation = useMutation({
    mutationFn: (data: CreateCountryDto) => CountryService.getInstance().createCountry(data),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const countryData = {
        ...formData,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(Boolean),
        popularStations: formData.popularStations.split(',').map(station => station.trim()).filter(Boolean),
        searchTerms: formData.searchTerms.split(',').map(term => term.trim()).filter(Boolean),
      }

      if (isEditMode && currentRow) {
        // TODO: Implement update when available in service
        console.log('Update country:', countryData)
      } else {
        await createMutation.mutateAsync(countryData as CreateCountryDto)
      }

      queryClient.invalidateQueries({ queryKey: ['countries'] })
      setOpen(null)
      resetForm()
    } catch (error) {
      console.error('Error saving country:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      isoCode: '',
      name: '',
      localName: '',
      continent: '',
      languages: '',
      dialingCode: '',
      capital: '',
      currency: '',
      stationCount: 0,
      popularStations: '',
      searchTerms: '',
    })
  }

  const handleClose = () => {
    setOpen(null)
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Country' : 'Add New Country'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the country information.'
              : 'Create a new country entry.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='isoCode'>ISO Code *</Label>
              <Input
                id='isoCode'
                value={formData.isoCode}
                onChange={(e) => setFormData({ ...formData, isoCode: e.target.value })}
                placeholder='US, GB, DE...'
                maxLength={3}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='name'>Country Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='United States'
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='localName'>Local Name *</Label>
              <Input
                id='localName'
                value={formData.localName}
                onChange={(e) => setFormData({ ...formData, localName: e.target.value })}
                placeholder='United States'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='continent'>Continent *</Label>
              <Input
                id='continent'
                value={formData.continent}
                onChange={(e) => setFormData({ ...formData, continent: e.target.value })}
                placeholder='America'
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='capital'>Capital *</Label>
              <Input
                id='capital'
                value={formData.capital}
                onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                placeholder='Washington, D.C.'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='currency'>Currency *</Label>
              <Input
                id='currency'
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder='USD'
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='dialingCode'>Dialing Code *</Label>
              <Input
                id='dialingCode'
                value={formData.dialingCode}
                onChange={(e) => setFormData({ ...formData, dialingCode: e.target.value })}
                placeholder='+1'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='languages'>Languages *</Label>
              <Input
                id='languages'
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                placeholder='English, Spanish (comma separated)'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='popularStations'>Popular Stations</Label>
            <Input
              id='popularStations'
              value={formData.popularStations}
              onChange={(e) => setFormData({ ...formData, popularStations: e.target.value })}
              placeholder='Station 1, Station 2 (comma separated)'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='searchTerms'>Search Terms</Label>
            <Input
              id='searchTerms'
              value={formData.searchTerms}
              onChange={(e) => setFormData({ ...formData, searchTerms: e.target.value })}
              placeholder='america, usa, states (comma separated)'
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
