import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { toast } from 'sonner'
import { useDeleteQuestionMutation } from '@/services/api/question-api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  questionId: string
}

export function CategoryQuestionDeleteModal({
  open,
  onOpenChange,
  questionId,
}: Props) {
  const [deleteQuestion] = useDeleteQuestionMutation()

  const handleDelete = async () => {
    try {
      await deleteQuestion(questionId).unwrap()
      toast.success('Question deleted successfully')
      onOpenChange(false)
    } catch {
      toast.error('Failed to delete question')
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Delete Question
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this question? This action cannot be
            undone.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
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
