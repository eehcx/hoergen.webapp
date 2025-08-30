import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { IconPlus, IconMusic } from '@tabler/icons-react'

// Services and hooks
import { StationService } from '@/core/services/stations/station.service'
import { GenreService } from '@/core/services/genres/genre.service'
import { CountryService } from '@/core/services/countries/country.service'
import { ImageUploadService } from '@/core/services/image-upload.service'
import { useAuth } from '@/hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'

// Types
import { CreateStationDto } from '@/core/types/station.types'

// UI Components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

interface FormData {
  name: string
  streamUrl: string
  description: string
  liveInfo: string
  coverImage: string
  countryId: string
  genreIds: string[]
}

export default function NewStation() {
  const { t } = useStaticTranslation();
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Get all available genres
  const { data: genres = [], isLoading: isLoadingGenres } = useQuery({
    queryKey: ['genres', 'all'],
    queryFn: () => GenreService.getInstance().getAllGenres(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
  
  // Get all available countries from API
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries', 'all'],
    queryFn: () => CountryService.getInstance().getAllCountries(),
    staleTime: 1000 * 60 * 10,
  })

  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      streamUrl: '',
      description: '',
      liveInfo: '',
      coverImage: '',
      countryId: '',
      genreIds: []
    }
  })

  // Watch form values for real-time updates
  const watchedValues = watch()

  // Create station mutation
  const createStationMutation = useMutation({
    mutationFn: async (data: CreateStationDto) => {
      const stationService = StationService.getInstance()
      return await stationService.createStation(data)
    },
    onSuccess: () => {
      toast.success(t('station.stationCreated'), {
        description: t('station.stationCreatedDescription'),
        duration: 5000,
      })
      // Redirect to the admin stations page
      navigate({ to: '/admin/stations' })
    },
    onError: (error: any) => {
      console.error('Error creating station:', error)
      toast.error(t('station.creationFailed'), {
        description: error.message || t('station.creationFailedDescription'),
        duration: 5000,
      })
    }
  })

  // Handle genre selection
  const toggleGenre = (genreId: string) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    
    setSelectedGenres(newSelectedGenres)
    setValue('genreIds', newSelectedGenres)
  }

  const [, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUploading, setCoverImageUploading] = useState(false)

  // Handle cover image upload
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageUploading(true)
      try {
        const url = await ImageUploadService.getInstance().uploadImage(file)
        setValue('coverImage', url)
        setCoverImageFile(file)
        toast.success(t('newStation.coverImageUploaded'))
      } catch (err: any) {
        toast.error('Error uploading image: ' + (err?.message || 'Unknown error'))
      }
      setCoverImageUploading(false)
    }
  }

  // Form submission
  const onSubmit = (data: FormData) => {
    if (selectedGenres.length === 0) {
      toast.error(t('newStation.genreRequired'), {
        description: t('newStation.genreRequiredDescription'),
        duration: 5000,
      })
      return
    }

    if (!selectedCountry) {
      toast.error(t('newStation.countryRequired'), {
        description: t('newStation.countryRequiredDescription'),
        duration: 5000,
      })
      return
    }

    const createStationData: CreateStationDto = {
      ownerId: user!.uid,
      name: data.name,
      streamUrl: data.streamUrl,
      description: data.description || undefined,
      liveInfo: data.liveInfo || undefined,
      coverImage: data.coverImage || undefined,
      countryId: selectedCountry,
      genreIds: selectedGenres,
      favoritesCount: 0
    }

    createStationMutation.mutate(createStationData)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl px-6 py-8">
          <div className='mb-6 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{t('newStation.title')}</h2>
              <p className='text-muted-foreground'>
                {t('newStation.description')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-card border border-border rounded-none">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t('newStation.basicInformation')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('newStation.basicInformationDescription')}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Station Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('newStation.stationName')}</label>
                    <input
                      {...register('name', { 
                        required: 'Station name is required',
                        minLength: { value: 3, message: 'Name must be at least 3 characters' },
                        maxLength: { value: 50, message: 'Name must be less than 50 characters' }
                      })}
                      className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={t('newStation.stationNamePlaceholder')}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Stream URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('newStation.streamUrl')}</label>
                    <input
                      {...register('streamUrl', { 
                        required: 'Stream URL is required',
                        pattern: {
                          value: /^https?:\/\/.+/, // regex
                          message: 'Please enter a valid URL starting with http:// or https://'
                        }
                      })}
                      className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={t('newStation.streamUrlPlaceholder')}
                    />
                    {errors.streamUrl && (
                      <p className="text-sm text-destructive">{errors.streamUrl.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('newStation.streamUrlHelp')} <a href="https://azuracast.example.com" target="_blank" rel="noopener" className="text-primary hover:underline">AzuraCast</a>.
                    </p>
                  </div>
                </div>

                {/* Country Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('newStation.country')}</label>
                  {isLoadingCountries ? (
                    <div className="h-10 bg-muted border border-border animate-pulse" />
                  ) : (
                    <Select
                      value={selectedCountry}
                      onValueChange={value => {
                        setSelectedCountry(value)
                        setValue('countryId', value)
                      }}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('newStation.countryPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country: any) => (
                          <SelectItem key={country.isoCode || country.id} value={country.isoCode || country.id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.countryId && (
                    <p className="text-sm text-destructive">{errors.countryId.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('newStation.description')}</label>
                  <textarea
                    {...register('description', {
                      maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                    })}
                    rows={4}
                    className="flex min-h-[80px] w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder={t('newStation.descriptionPlaceholder')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.description?.length || 0}/500 characters
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Live Info */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('newStation.liveInfo')}</label>
                    <input
                      {...register('liveInfo', {
                        maxLength: { value: 100, message: 'Live info must be less than 100 characters' }
                      })}
                      className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={t('newStation.liveInfoPlaceholder')}
                    />
                    {errors.liveInfo && (
                      <p className="text-sm text-destructive">{errors.liveInfo.message}</p>
                    )}
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('newStation.coverImage')}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm"
                      disabled={coverImageUploading}
                    />
                    {coverImageUploading && <p className="text-xs text-muted-foreground">{t('newStation.uploading')}</p>}
                    {watchedValues.coverImage && (
                      <img src={watchedValues.coverImage} alt="Cover Preview" className="mt-2 w-24 h-24 object-cover border" />
                    )}
                    {errors.coverImage && (
                      <p className="text-sm text-destructive">{errors.coverImage.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Genres Section */}
            <Card className="bg-card border border-border rounded-none">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <IconMusic className="h-5 w-5" />
                  <div>
                    <h3 className="text-lg font-semibold">{t('newStation.genres')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('newStation.genresDescription')}
                    </p>
                  </div>
                </div>
                {/* Genre Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">{t('newStation.genresLabel')}</label>
                  {isLoadingGenres ? (
                    <div className="grid gap-3 md:grid-cols-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted border border-border animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-4">
                      {genres.map((genre: any) => (
                        <button
                          key={genre.id}
                          type="button"
                          onClick={() => toggleGenre(genre.id)}
                          className={`p-3 border transition-colors text-left ${
                            selectedGenres.includes(genre.id)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50 hover:bg-accent'
                          }`}
                        >
                          <span className="font-medium text-sm">{genre.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {selectedGenres.length} {t('newStation.genresSelected')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Preview */}
            {(watchedValues.name || watchedValues.description) && (
              <Card className="bg-card border border-border rounded-none">
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{t('newStation.preview')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('newStation.previewDescription')}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-background border border-border flex items-center justify-center overflow-hidden">
                        {watchedValues.coverImage ? (
                          <img
                            src={watchedValues.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <IconMusic className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {watchedValues.name || t('newStation.previewStationName')}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {watchedValues.description || t('newStation.previewStationDescription')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedGenres.slice(0, 3).map(genreId => {
                            const genre = genres.find((g: any) => g.id === genreId)
                            return genre ? (
                              <Badge key={genreId} variant="outline">
                                {genre.name}
                              </Badge>
                            ) : null
                          })}
                          {selectedGenres.length > 3 && (
                            <Badge variant="outline">
                              +{selectedGenres.length - 3} {t('newStation.moreGenres')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: '/' })}
              >
                {t('newStation.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createStationMutation.isPending}
              >
                {createStationMutation.isPending ? (
                  <>
                    <div className="animate-pulse h-4 w-4 bg-current mr-2" />
                    {t('newStation.creating')}
                  </>
                ) : (
                  <>
                    <IconPlus className="h-4 w-4 mr-2" />
                    {t('newStation.createStation')}
                  </>
                )}
              </Button>
            </div>

            {/* Custom Footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('newStation.helpText')}{' '}
                  <a href="#" className="text-primary hover:underline">{t('newStation.documentation')}</a> {t('newStation.or')}{' '}
                  <a href="#" className="text-primary hover:underline">{t('newStation.contactSupport')}</a>.
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('newStation.termsAgreement')}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}