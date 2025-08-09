import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { CountryResponseDto } from '@/core/types'

type CountriesDialogType = 'add' | 'edit' | 'delete'

interface CountriesContextType {
    open: CountriesDialogType | null
    setOpen: (str: CountriesDialogType | null) => void
    currentRow: CountryResponseDto | null
    setCurrentRow: React.Dispatch<React.SetStateAction<CountryResponseDto | null>>
}

const CountriesContext = React.createContext<CountriesContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function CountriesProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<CountriesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<CountryResponseDto | null>(null)

    return (
        <CountriesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </CountriesContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCountriesContext = () => {
    const countriesContext = React.useContext(CountriesContext)

    if (!countriesContext) {
        throw new Error('useCountriesContext has to be used within <CountriesContext>')
    }

    return countriesContext
}
