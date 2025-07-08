import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { Cross2Icon, ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { useEffect, useState } from 'react'
import { Formik } from 'formik'
import {
  useLazyGetAllTagsQuery,
  useAddCategoryTagMutation,
  type Tag,
} from '@/services/api/tag-api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
}

export function CategoryAddTagModal({ open, onOpenChange, categoryId }: Props) {
  const [getAllTags, { data: tagsData }] = useLazyGetAllTagsQuery()
  const [addTagToCategory] = useAddCategoryTagMutation()
  const [selectedTagId, setSelectedTagId] = useState<string>('')

  const tags = tagsData?.data ?? []

  useEffect(() => {
    if (open) {
      getAllTags({ page: '1', size: '100', lang: 'tr' })
      setSelectedTagId('')
    }
  }, [open])

  const handleSubmit = async () => {
    if (!selectedTagId) return
    await addTagToCategory({ categoryId, tagId: selectedTagId })
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="z-50 fixed top-[50%] left-[50%] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Add Tag to Category
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Select a tag to associate with this category.
          </Dialog.Description>

          <Formik
            initialValues={{}}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit()
              setSubmitting(false)
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tag</Label>
                  <Select.Root
                    value={selectedTagId}
                    onValueChange={(value) => setSelectedTagId(value)}
                  >
                    <Select.Trigger className="w-full inline-flex items-center justify-between px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <Select.Value placeholder="Select tag" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-md border bg-white shadow-md z-50">
                        <Select.Viewport className="p-1">
                          {tags.map((tag: Tag) => (
                            <Select.Item
                              key={tag.id}
                              value={tag.id}
                              className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                            >
                              <Select.ItemText>{tag.name}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="flex justify-end gap-2 pt-4">
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
                    disabled={isSubmitting || !selectedTagId}
                  >
                    Add Tag
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
