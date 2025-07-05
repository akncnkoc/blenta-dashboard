import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Category } from '@/services/api/category-api'

interface Props {
  category: Category | null
  onClose: () => void
}

export function CategoryDetailsModal({ category, onClose }: Props) {
  return (
    <Dialog.Root open={!!category} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-w-md w-full translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Category Info
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Detailed information about the selected category.
          </Dialog.Description>

          {category && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {category.name}
              </p>
              <p>
                <strong>Description:</strong> {category.description}
              </p>
              <p>
                <strong>Is Premium Cat:</strong>{' '}
                {category.isPremiumCat ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Is Ref Cat:</strong> {category.isRefCat ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Color:</strong> {category.color}
              </p>
            </div>
          )}

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
