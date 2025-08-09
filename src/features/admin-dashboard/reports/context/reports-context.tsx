import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { ResponseReportDto } from '@/core/types'

type ReportsDialogType = 'add' | 'edit' | 'delete' | 'assign'

interface ReportsContextType {
  open: ReportsDialogType | null
  setOpen: (str: ReportsDialogType | null) => void
  currentRow: ResponseReportDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ResponseReportDto | null>>
}

const ReportsContext = React.createContext<ReportsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ReportsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ReportsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ResponseReportDto | null>(null)

  return (
    <ReportsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ReportsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useReportsContext = () => {
  const reportsContext = React.useContext(ReportsContext)

  if (!reportsContext) {
    throw new Error('useReportsContext has to be used within <ReportsContext>')
  }

  return reportsContext
}
