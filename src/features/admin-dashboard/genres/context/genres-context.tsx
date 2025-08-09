import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { GenreResponseDto } from '@/core/types'

type GenresDialogType = 'add' | 'edit' | 'delete'

interface GenresContextType {
    open: GenresDialogType | null
    setOpen: (str: GenresDialogType | null) => void
    currentRow: GenreResponseDto | null
    setCurrentRow: React.Dispatch<React.SetStateAction<GenreResponseDto | null>>
}

const GenresContext = React.createContext<GenresContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function GenresProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<GenresDialogType>(null)
    const [currentRow, setCurrentRow] = useState<GenreResponseDto | null>(null)

    return (
        <GenresContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </GenresContext.Provider>
    )
}

export const useGenresContext = () => {
    const genresContext = React.useContext(GenresContext)
    if (!genresContext) {
        throw new Error('useGenresContext has to be used within <GenresContext>')
    }
    return genresContext
}
