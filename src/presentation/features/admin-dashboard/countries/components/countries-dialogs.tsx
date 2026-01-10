import { CountriesActionDialog } from './countries-action-dialog.tsx'
import { CountriesDeleteDialog } from './countries-delete-dialog.tsx'

export function CountriesDialogs() {
  return (
    <>
      <CountriesActionDialog key='countries-add' />
      <CountriesDeleteDialog key='countries-delete' />
    </>
  )
}
