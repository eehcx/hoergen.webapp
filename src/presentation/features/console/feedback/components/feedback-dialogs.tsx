import { FeedbackDeleteDialog } from './feedback-delete-dialog.tsx'
import { FeedbackViewDialog } from './feedback-view-dialog.tsx'

export function FeedbackDialogs() {
    return (
        <>
            <FeedbackViewDialog />
            <FeedbackDeleteDialog />
        </>
    )
}
