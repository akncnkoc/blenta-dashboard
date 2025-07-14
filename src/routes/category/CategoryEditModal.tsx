import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Select from '@radix-ui/react-select'
import { Cross2Icon, CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { Formik } from 'formik'
import {
  useLazyGetAllCategoriesQuery,
  useLazyGetCategoryQuery,
  useUpdateCategoryMutation,
} from '@/services/api/category-api'
import { useEffect, useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
}

type FormValues = {
  name: string
  sort: number
  description: string
  parentCategoryId: string | null
  culture: 'tr' | 'en'
  color: string
  type: 'QUESTION' | 'TEST'
  isPremiumCat: boolean
  isRefCat: boolean
}

export function CategoryEditModal({ open, onOpenChange, categoryId }: Props) {
  const [_, setLang] = useState<'en' | 'tr'>('tr')
  const [getCategory, { data: categoryData }] = useLazyGetCategoryQuery()
  const [updateCategory] = useUpdateCategoryMutation()
  const [getAllCategories, { data: allCategories }] =
    useLazyGetAllCategoriesQuery()
  const [initialValues, setInitialValues] = useState<FormValues | null>(null)

  useEffect(() => {
    if (open && categoryId) {
      getCategory(categoryId)
    }
  }, [open, categoryId])

  useEffect(() => {
    if (categoryData) {
      const cat = categoryData
      console.log(cat)
      setInitialValues({
        name: cat.name ?? '',
        description: cat.description ?? '',
        sort: cat.sort,
        parentCategoryId: cat.parentCategoryId ?? null,
        culture: cat.culture ?? 'tr',
        color: '000000',
        type: cat.type ?? 'QUESTION',
        isPremiumCat: cat.isPremiumCat ?? false,
        isRefCat: cat.isRefCat ?? false,
      })

      getAllCategories({
        page: '1',
        size: '1000',
        lang: cat.culture ?? 'tr',
      })

      setLang(cat.culture)
    }
  }, [categoryData])
  if (!initialValues) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Edit Category
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Modify and update the selected category.
          </Dialog.Description>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              // Submit update request here
              setSubmitting(false)

              var res = await updateCategory({
                ...values,
                id: categoryId,
              }).unwrap()
              if (res.error) {
                toast.error('Category cannot updated')
                return
              }
              toast.success('Category updated')
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
                {/* -- Culture -- */}
                <Label>Culture</Label>
                <Select.Root
                  value={values.culture}
                  onValueChange={(value) => {
                    setFieldValue('culture', value)
                    getAllCategories({
                      page: '1',
                      size: '1000',
                      lang: value,
                    })
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

                {/* Description */}
                <Label>Description</Label>
                <input
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                />

                {/* Type */}
                <Label>Type</Label>
                <Select.Root
                  value={values.type}
                  onValueChange={(val) => setFieldValue('type', val)}
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
                        {['QUESTION', 'TEST'].map((type) => (
                          <Select.Item
                            key={type}
                            value={type}
                            className="relative flex items-center px-8 py-2 rounded-md text-sm cursor-pointer data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
                          >
                            <Select.ItemText>{type}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                {/* Parent Category */}
                <Label>Parent Category</Label>
                <Select.Root
                  value={values.parentCategoryId ?? ''}
                  onValueChange={(value) =>
                    setFieldValue(
                      'parentCategoryId',
                      value === 'empty' ? null : value,
                    )
                  }
                >
                  <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <Select.Value placeholder="Select" />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-md border bg-white shadow-md">
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value="empty"
                          className="relative flex items-center px-8 py-2 rounded-md text-sm"
                        >
                          <Select.ItemText>None</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                        {allCategories?.data?.map((category) => (
                          <Select.Item
                            key={category.id}
                            value={category.id}
                            className="relative flex items-center px-8 py-2 rounded-md text-sm"
                          >
                            <Select.ItemText>{category.name}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                {/* Color */}
                <Label>Color</Label>
                <input
                  type="color"
                  name="color"
                  value={'#000000'}
                  onChange={handleChange}
                  className="h-10 w-full rounded cursor-pointer"
                />

                <Label>Sort</Label>
                <input
                  type="number"
                  name="sort"
                  value={values.sort}
                  onChange={handleChange}
                  className="h-10 w-full rounded cursor-pointer"
                />

                {/* Checkboxes */}
                <div className="flex flex-col gap-3 mt-2 col-span-2">
                  <label className="inline-flex items-center gap-2">
                    <Checkbox.Root
                      checked={values.isPremiumCat}
                      onCheckedChange={(checked) =>
                        setFieldValue('isPremiumCat', checked === true)
                      }
                      className="w-5 h-5 border rounded flex items-center justify-center"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="w-4 h-4 text-blue-600" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    Premium Category
                  </label>

                  <label className="inline-flex items-center gap-2">
                    <Checkbox.Root
                      checked={values.isRefCat}
                      onCheckedChange={(checked) =>
                        setFieldValue('isRefCat', checked === true)
                      }
                      className="w-5 h-5 border rounded flex items-center justify-center"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="w-4 h-4 text-blue-600" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    Reference Category
                  </label>
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
