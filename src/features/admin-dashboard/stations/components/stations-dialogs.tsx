import { StationsActionDialog } from './stations-action-dialog'
import { StationsDeleteDialog } from './stations-delete-dialog'

export function StationsDialogs() {
    return (
        <>
            <StationsActionDialog key='stations-add' />
            <StationsDeleteDialog key='stations-delete' />
        </>
    )
}
