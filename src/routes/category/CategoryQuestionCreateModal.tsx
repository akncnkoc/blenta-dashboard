import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Formik } from 'formik'
import { Label } from '@radix-ui/react-label'
import { toast } from 'sonner'
import { useCreateQuestionMutation } from '@/services/api/question-api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
}

export function CategoryQuestioCreateModal({
  open,
  onOpenChange,
  categoryId,
}: Props) {
  const [createQuestion] = useCreateQuestionMutation()

  const initialValues = {
    title: '',
    description: '',
    sort: 1,
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Create Question
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Add a new question to this category.
          </Dialog.Description>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await createQuestion({
                  ...values,
                  categoryId,
                }).unwrap()
                toast.success('Question added successfully')
                onOpenChange(false)
              } catch (err) {
                toast.error('Failed to add question')
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <form
                className="grid grid-cols-1 gap-4 text-sm"
                onSubmit={handleSubmit}
              >
                <div>
                  <Label htmlFor="title">Title</Label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={values.title}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <input
                    id="description"
                    name="description"
                    type="text"
                    value={values.description}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sort">Sort</Label>
                  <input
                    id="sort"
                    name="sort"
                    type="number"
                    value={values.sort}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-2 rounded border bg-white hover:bg-gray-100"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
          </Formik>

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
