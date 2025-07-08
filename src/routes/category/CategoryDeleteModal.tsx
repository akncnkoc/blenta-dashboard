import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useDeleteCategoryMutation } from '@/services/api/category-api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
  categoryName: string
}

export function CategoryDeleteModal({
  open,
  onOpenChange,
  categoryId,
  categoryName,
}: Props) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation()

  const handleDelete = async () => {
    await deleteCategory(categoryId)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="z-50 fixed top-[50%] left-[50%] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Delete Category
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-red-600">{categoryName}</span>?
            <br />
            This action cannot be undone.
          </Dialog.Description>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full text-gray-500"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
