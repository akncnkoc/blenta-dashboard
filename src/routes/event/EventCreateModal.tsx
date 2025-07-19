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
import { useLazyGetAllEventTagsQuery } from '@/services/api/event-tag-api'
import { useCreateEventMutation } from '@/services/api/event-api'
import { useEffect, useState } from 'react'
import { EventTagMultiSelect } from './components/EventTagMultiSelect'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventCreateModal({ open, onOpenChange }: Props) {
  const [getAllEventTags, { data: eventTags }] = useLazyGetAllEventTagsQuery()
  const [createEvent] = useCreateEventMutation()

  const [lang, setLang] = useState('tr')

  const initialValues: {
    name: string
    culture: string
    tagIds: Array<string>
  } = {
    name: '',
    culture: lang,
    tagIds: [],
  }

  useEffect(() => {
    if (open) {
      getAllEventTags({ lang, page: '1', size: '100' })
    }
  }, [open, lang])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Create Event
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Add a new event
          </Dialog.Description>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false)
              const res = await createEvent(values)
              if (res.error) {
                toast.error('Event not added')
                return
              }
              toast.success('Event created')
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
                <Label>Name</Label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  required
                />
                <Label>Event Tags</Label>
                <EventTagMultiSelect lang={lang} />

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
