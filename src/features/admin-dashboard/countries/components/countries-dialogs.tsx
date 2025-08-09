import { CountriesActionDialog } from './countries-action-dialog'
import { CountriesDeleteDialog } from './countries-delete-dialog'

export function CountriesDialogs() {
  return (
    <>
      <CountriesActionDialog key='countries-add' />
      <CountriesDeleteDialog key='countries-delete' />
    </>
  )
}
