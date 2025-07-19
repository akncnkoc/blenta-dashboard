import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { Cross2Icon, CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { toast } from 'sonner'
import {
  useLazyGetEventTagQuery,
  useUpdateEventTagMutation,
} from '@/services/api/event-tag-api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventTagId: string
}

type FormValues = {
  name: string
  culture: 'tr' | 'en'
  question: string
}

export function EventTagEditModal({ open, onOpenChange, eventTagId }: Props) {
  const [_, setLang] = useState<'en' | 'tr'>('tr')
  const [getEventTag, { data: eventTagData }] = useLazyGetEventTagQuery()
  const [updateEventTag] = useUpdateEventTagMutation()
  const [initialValues, setInitialValues] = useState<FormValues | null>(null)

  useEffect(() => {
    if (open && eventTagId) {
      getEventTag(eventTagId)
    }
  }, [open, eventTagId])

  useEffect(() => {
    if (eventTagData) {
      const cat = eventTagData
      setInitialValues({
        name: cat.name,
        culture: cat.culture as 'tr' | 'en',
        question: cat.question,
      })

      setLang(cat.culture as 'tr' | 'en')
    }
  }, [eventTagData])
  if (!initialValues) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Edit Event Tag
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Modify and update the selected event tag.
          </Dialog.Description>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              // Submit update request here
              setSubmitting(false)

              var res = await updateEventTag({
                ...values,
                id: eventTagId,
              })
              if (res.error) {
                toast.error('Event tag cannot updated')
                return
              }
              toast.success('Event Tag updated')
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
                <Label>Culture</Label>
                <Select.Root
                  value={values.culture}
                  onValueChange={(value) => {
                    setFieldValue('culture', value)
                    setLang(value as 'en' | 'tr')
                  }}
                >
                  <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-md border bg-white shadow-md">
                      <Select.Viewport className="p-1">
                        {['tr', 'en'].map((lang) => (
                          <Select.Item
                            key={lang}
                            value={lang}
                            className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                          >
                            <Select.ItemText>
                              {lang.toUpperCase()}
                            </Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                {/* Name */}
                <Label>Name</Label>
                <input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                />
                {/* Name */}
                <Label>Question</Label>
                <input
                  name="question"
                  value={values.question}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                />

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
