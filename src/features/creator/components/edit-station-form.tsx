import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { ResponseStationDto, UpdateStationDto } from "@/core/types/station.types"

interface EditStationFormProps {
    station: ResponseStationDto
    onSubmit: (data: UpdateStationDto) => void
    onCancel: () => void
    isLoading?: boolean
}

export function EditStationForm({ station, onSubmit, onCancel, isLoading = false }: EditStationFormProps) {
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
            newErrors.name = "Station name is required"
        }

        if (!formData.streamUrl?.trim()) {
            newErrors.streamUrl = "Stream URL is required"
        } else {
            // Basic URL validation
            try {
                new URL(formData.streamUrl)
            } catch {
                newErrors.streamUrl = "Please enter a valid URL"
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
                <DialogTitle>Edit Station</DialogTitle>
                <DialogDescription>
                    Update the information for your radio station.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Station Name *</Label>
                    <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter station name"
                        className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="streamUrl">Stream URL *</Label>
                    <Input
                        id="streamUrl"
                        value={formData.streamUrl || ""}
                        onChange={(e) => handleInputChange("streamUrl", e.target.value)}
                        placeholder="https://example.com/stream"
                        className={errors.streamUrl ? "border-destructive" : ""}
                    />
                    {errors.streamUrl && (
                        <p className="text-sm text-destructive">{errors.streamUrl}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your radio station..."
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="liveInfo">Live Information</Label>
                    <Input
                        id="liveInfo"
                        value={formData.liveInfo || ""}
                        onChange={(e) => handleInputChange("liveInfo", e.target.value)}
                        placeholder="Currently playing information"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                        id="coverImage"
                        value={formData.coverImage || ""}
                        onChange={(e) => handleInputChange("coverImage", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </>
    )
}
