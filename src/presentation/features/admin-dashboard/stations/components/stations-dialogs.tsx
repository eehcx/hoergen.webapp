import { StationsActionDialog } from './stations-action-dialog.tsx'
import { StationsDeleteDialog } from './stations-delete-dialog.tsx'

export function StationsDialogs() {
    return (
        <>
            <StationsActionDialog key='stations-add' />
            <StationsDeleteDialog key='stations-delete' />
        </>
    )
}
