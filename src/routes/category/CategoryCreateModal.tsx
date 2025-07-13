import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Select from '@radix-ui/react-select'
import {
  Cross2Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import { Formik } from 'formik'
import {
  CreateCategoryRequest,
  useCreateCategoryMutation,
  useLazyGetAllCategoriesQuery,
} from '@/services/api/category-api'
import { useEffect } from 'react'
import { Label } from '@radix-ui/react-label'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentCategoryCulture?: string
}

export function CategoryCreateModal({
  open,
  onOpenChange,
  parentCategoryCulture,
}: Props) {
  const initialValues: CreateCategoryRequest = {
    name: '',
    description: '',
    parentCategoryId: '',
    culture: parentCategoryCulture ?? 'tr',
    color: '#000000',
    type: 'QUESTION',
    isRefCat: false,
    isPremiumCat: false,
  }
  const [getAllCategories, { data }] = useLazyGetAllCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()
  useEffect(() => {
    getAllCategories({
      lang: 'tr',
      page: '1',
      size: '100',
    })
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Create Category
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Add a new category to the system.
          </Dialog.Description>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false)
              var res = await createCategory(values).unwrap()
              if (res.error) {
                toast.error('Category cannot added')
                return
              }
              toast.success('Category added')
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
                {/* Culture (Radix Select) */}
                <Label>Culture</Label>
                <Select.Root
                  value={values.culture}
                  onValueChange={(value) => {
                    getAllCategories({
                      page: '1',
                      size: '1000',
                      lang: value,
                    })
                    setFieldValue('culture', value)
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
                <Label>Name</Label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  required
                />

                {/* Description (text input) */}

                <Label>Description</Label>
                <input
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                />

                <Label>Type</Label>

                <Select.Root
                  value={values.type}
                  onValueChange={(value) => setFieldValue('type', value)}
                >
                  <Select.Trigger
                    aria-label="Type"
                    className="inline-flex items-center justify-between w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content
                      align="start"
                      sideOffset={4}
                      side="bottom"
                      className="overflow-hidden rounded-md border border-gray-300 bg-white shadow-md"
                    >
                      <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>

                      <Select.Viewport className="p-1">
                        <Select.Item
                          value="QUESTION"
                          className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer select-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <Select.ItemText>Question</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>

                        <Select.Item
                          value="TEST"
                          className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer select-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <Select.ItemText>Test</Select.ItemText>
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

                {/* Culture (Radix Select) */}
                <Label>Parent Category</Label>
                <Select.Root
                  value={values.parentCategoryId ?? ''}
                  onValueChange={(value) => {
                    if (value == 'empty') {
                      setFieldValue('parentCategoryId', null)
                      return
                    }
                    setFieldValue('parentCategoryId', value)
                  }}
                >
                  <Select.Trigger
                    aria-label="Parent Category"
                    className="inline-flex items-center justify-between w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Select.Value placeholder="Select" />
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
                          value={'empty'}
                          className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer select-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                        >
                          <Select.ItemText>None</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                        {data &&
                          data?.data?.map((category) => {
                            return (
                              <Select.Item
                                key={category.id}
                                value={category.id}
                                className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer select-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                              >
                                <Select.ItemText>
                                  {category.name}
                                </Select.ItemText>
                                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                                  <CheckIcon />
                                </Select.ItemIndicator>
                              </Select.Item>
                            )
                          })}
                      </Select.Viewport>

                      <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
                        <ChevronDownIcon />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                {/* Color picker (native input, styled) */}
                <Label>Color</Label>
                <input
                  type="color"
                  className="w-full h-10 rounded cursor-pointer"
                  name="color"
                  value={values.color}
                  onChange={handleChange}
                />

                {/* Checkboxes */}
                <div className="flex flex-col gap-3 mt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox.Root
                      checked={values.isPremiumCat}
                      onCheckedChange={(checked) =>
                        setFieldValue('isPremiumCat', checked === true)
                      }
                      className="w-5 h-5 border rounded-md border-gray-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="w-4 h-4 text-blue-600" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    Premium Category
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox.Root
                      checked={values.isRefCat}
                      onCheckedChange={(checked) =>
                        setFieldValue('isRefCat', checked === true)
                      }
                      className="w-5 h-5 border rounded-md border-gray-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="w-4 h-4 text-blue-600" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    Reference Category
                  </label>
                </div>

                {/* Buttons */}
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
