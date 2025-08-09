// Service to upload images to Firebase Storage and get public URL
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/core/firebase'

export class ImageUploadService {
    static instance: ImageUploadService

    static getInstance() {
        if (!ImageUploadService.instance) {
            ImageUploadService.instance = new ImageUploadService()
        }
        return ImageUploadService.instance
    }

    async uploadImage(file: File): Promise<string> {
        // Usar la instancia de storage importada
        const storageRef = ref(storage, `stations/covers/${Date.now()}_${file.name}`)
        await uploadBytes(storageRef, file)
        return await getDownloadURL(storageRef)
    }
}
