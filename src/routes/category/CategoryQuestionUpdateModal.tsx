import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Formik } from 'formik'
import { Label } from '@radix-ui/react-label'
import { toast } from 'sonner'
import { useUpdateQuestionMutation } from '@/services/api/question-api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: {
    id: string
    title: string
    categoryId: string
    description: string
    sort: number
  }
}

export function CategoryQuestionUpdateModal({
  open,
  onOpenChange,
  question,
}: Props) {
  const [updateQuestion] = useUpdateQuestionMutation()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Update Question
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Modify the question details below.
          </Dialog.Description>

          <Formik
            initialValues={{
              title: question.title,
              categoryId: question.categoryId,
              description: question.description,
              culture: question.culture,
              sort: question.sort,
            }}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await updateQuestion({
                  id: question.id,
                  ...values,
                }).unwrap()
                toast.success('Question updated successfully')
                onOpenChange(false)
              } catch (err) {
                toast.error('Failed to update question')
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
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    required
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="culture">Culture</Label>
                  <select
                    id="culture"
                    name="culture"
                    value={values.culture}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tr">TR</option>
                    <option value="en">EN</option>
                  </select>
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

                <div className="mt-4 flex justify-end gap-2">
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
                    Update
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
