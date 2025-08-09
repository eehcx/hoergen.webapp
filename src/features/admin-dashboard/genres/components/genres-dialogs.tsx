import { useGenresContext } from '../context/genres-context'
import { GenresActionDialog } from './genres-action-dialog'
import { GenresDeleteDialog } from './genres-delete-dialog'

export function GenresDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useGenresContext()
  return (
    <>
      <GenresActionDialog
        key='genre-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <GenresActionDialog
            key={`genre-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <GenresDeleteDialog
            key={`genre-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
