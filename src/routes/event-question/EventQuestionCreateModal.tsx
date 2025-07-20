import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import {
  Cross2Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import { Formik } from 'formik'
import { Label } from '@radix-ui/react-label'
import { toast } from 'sonner'
import { useState } from 'react'
import { useCreateEventQuestionMutation } from '@/services/api/event-question-api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventQuestionCreateModal({ open, onOpenChange }: Props) {
  const [createEventQuestion] = useCreateEventQuestionMutation()

  const [lang, setLang] = useState('tr')

  const initialValues: {
    text: string
    culture: string
    answers: Array<string>
  } = {
    text: '',
    culture: lang,
    answers: [],
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Create Event Question
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Add a new event question
          </Dialog.Description>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false)
              const res = await createEventQuestion(values)
              if (res.error) {
                toast.error('Event question not added')
                return
              }
              toast.success('Event question created')
              onOpenChange(false)
            }}
          >
            {({
              values,
              setFieldValue,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                className="grid grid-rows-2 grid-cols-2 space-y-4 text-sm"
                onSubmit={handleSubmit}
              >
                {/* Culture Select */}
                <Label>Culture</Label>
                <Select.Root
                  value={values.culture}
                  onValueChange={(value) => {
                    setFieldValue('culture', value)
                    setLang(value)
                  }}
                >
                  <Select.Trigger
                    aria-label="Culture"
                    className="inline-flex items-center justify-between w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-md border border-gray-300 bg-white shadow-md">
                      <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value="tr"
                          className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer select-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <Select.ItemText>TR</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item
                          value="en"
                          className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer select-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <Select.ItemText>EN</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      </Select.Viewport>
                      <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
                        <ChevronDownIcon />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                {/* Name Input */}
                <Label>Question</Label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Question"
                  name="text"
                  value={values.text}
                  onChange={handleChange}
                  required
                />

                <Label>Answers</Label>
                {/* Repeatable Answers Input */}
                <div>
                  <div className="flex flex-col space-y-2 max-h-48 overflow-auto">
                    {values.answers.map((answer, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-grow border px-3 py-2 rounded focus:outline-none"
                          placeholder={`Answer ${index + 1}`}
                          value={answer}
                          onChange={(e) => {
                            const updated = [...values.answers]
                            updated[index] = e.target.value
                            setFieldValue('answers', updated)
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...values.answers]
                            updated.splice(index, 1)
                            setFieldValue('answers', updated)
                          }}
                          className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                          aria-label={`Remove answer ${index + 1}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue('answers', [...values.answers, ''])
                    }
                    className="mt-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                  >
                    + Add Answer
                  </button>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end gap-2 col-span-2">
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
