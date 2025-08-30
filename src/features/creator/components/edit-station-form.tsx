import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { ResponseStationDto, UpdateStationDto } from "@/core/types/station.types"
import { useStaticTranslation } from "@/hooks/useTranslation"

interface EditStationFormProps {
    station: ResponseStationDto
    onSubmit: (data: UpdateStationDto) => void
    onCancel: () => void
    isLoading?: boolean
}

export function EditStationForm({ station, onSubmit, onCancel, isLoading = false }: EditStationFormProps) {
    const { t } = useStaticTranslation();
    
    const [formData, setFormData] = useState<UpdateStationDto>({
        name: station.name,
        streamUrl: station.streamUrl,
        description: station.description || "",
        liveInfo: station.liveInfo || "",
        coverImage: station.coverImage || "",
        countryId: station.countryId,
        genreIds: station.genreIds,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name?.trim()) {
            newErrors.name = t('creatorComponents.stationNameRequired')
        }

        if (!formData.streamUrl?.trim()) {
            newErrors.streamUrl = t('creatorComponents.streamUrlRequired')
        } else {
            // Basic URL validation
            try {
                new URL(formData.streamUrl)
            } catch {
                newErrors.streamUrl = t('creatorComponents.invalidUrl')
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const handleInputChange = (field: keyof UpdateStationDto, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }))
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{t('creatorComponents.editStation')}</DialogTitle>
                <DialogDescription>
                    {t('creatorComponents.updateStationInfo')}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('creatorComponents.stationName')}</Label>
                    <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={t('creatorComponents.stationNamePlaceholder')}
                        className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="streamUrl">{t('creatorComponents.streamUrl')}</Label>
                    <Input
                        id="streamUrl"
                        value={formData.streamUrl || ""}
                        onChange={(e) => handleInputChange("streamUrl", e.target.value)}
                        placeholder={t('creatorComponents.streamUrlPlaceholder')}
                        className={errors.streamUrl ? "border-destructive" : ""}
                    />
                    {errors.streamUrl && (
                        <p className="text-sm text-destructive">{errors.streamUrl}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{t('creatorComponents.description')}</Label>
                    <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder={t('creatorComponents.descriptionPlaceholder')}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="liveInfo">{t('creatorComponents.liveInfo')}</Label>
                    <Input
                        id="liveInfo"
                        value={formData.liveInfo || ""}
                        onChange={(e) => handleInputChange("liveInfo", e.target.value)}
                        placeholder={t('creatorComponents.liveInfoPlaceholder')}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="coverImage">{t('creatorComponents.coverImage')}</Label>
                    <Input
                        id="coverImage"
 value={formData.coverImage || ""}
                        onChange={(e) => handleInputChange("coverImage", e.target.value)}
                        placeholder={t('creatorComponents.coverImagePlaceholder')}
                    />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {t('creatorComponents.cancel')}
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? t('creatorComponents.saving') : t('creatorComponents.saveChanges')}
                    </Button>
                </div>
            </form>
        </>
    )
}
