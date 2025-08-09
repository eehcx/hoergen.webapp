import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { ResponseFeedbackDto } from '@/core/types'

type FeedbackDialogType = 'delete' | 'view'

interface FeedbackContextType {
  open: FeedbackDialogType | null
  setOpen: (str: FeedbackDialogType | null) => void
  currentRow: ResponseFeedbackDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ResponseFeedbackDto | null>>
}

const FeedbackContext = React.createContext<FeedbackContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function FeedbackProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<FeedbackDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ResponseFeedbackDto | null>(null)

  return (
    <FeedbackContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </FeedbackContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFeedbackContext = () => {
  const feedbackContext = React.useContext(FeedbackContext)

  if (!feedbackContext) {
    throw new Error('useFeedbackContext has to be used within <FeedbackContext>')
  }

  return feedbackContext
}
