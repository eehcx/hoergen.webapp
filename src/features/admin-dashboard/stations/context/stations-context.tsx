import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ResponseStationDto } from '@/core/types'

type StationsDialogType = 'add' | 'edit' | 'delete'

interface StationsContextType {
    open: StationsDialogType | null
    setOpen: (str: StationsDialogType | null) => void
    currentRow: ResponseStationDto | null
    setCurrentRow: React.Dispatch<React.SetStateAction<ResponseStationDto | null>>
}

const StationsContext = React.createContext<StationsContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function StationsProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<StationsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<ResponseStationDto | null>(null)

    return (
        <StationsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </StationsContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStationsContext = () => {
    const stationsContext = React.useContext(StationsContext)

    if (!stationsContext) {
        throw new Error('useStationsContext has to be used within <StationsContext>')
    }

    return stationsContext
}
