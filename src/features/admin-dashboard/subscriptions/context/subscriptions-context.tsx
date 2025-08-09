import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ProductWithPriceResponse } from '@/core/types/product.types'

type SubscriptionsDialogType = 'add' | 'edit' | 'delete'

interface SubscriptionsContextType {
    open: SubscriptionsDialogType | null
    setOpen: (str: SubscriptionsDialogType | null) => void
    currentRow: ProductWithPriceResponse | null
    setCurrentRow: React.Dispatch<React.SetStateAction<ProductWithPriceResponse | null>>
}

const SubscriptionsContext = React.createContext<SubscriptionsContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function SubscriptionsProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<SubscriptionsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<ProductWithPriceResponse | null>(null)

    return (
        <SubscriptionsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </SubscriptionsContext.Provider>
    )
}

export const useSubscriptionsContext = () => {
    const subscriptionsContext = React.useContext(SubscriptionsContext)
    if (!subscriptionsContext) {
        throw new Error('useSubscriptionsContext has to be used within <SubscriptionsContext>')
    }
    return subscriptionsContext
}
