import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Category } from '@/services/api/category-api'

interface Props {
  category: Category
  onShowChildren: (cat: Category) => void
  onEdit: (cat: Category) => void
  onDelete: (id: string, name: string) => void
  showCategoryTags: (id: string) => void
  showCategoryQuestions: (id: string) => void
  showChildCategories: (id: string) => void
  onAddTag: (id: string) => void
  onAddQuestion: (id: string) => void
}

export function CategoryActionsMenu({
  category,
  onShowChildren,
  onEdit,
  onDelete,
  onAddTag,
  showCategoryTags,
  showCategoryQuestions,
  showChildCategories,
  onAddQuestion,
}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 rounded hover:bg-gray-100">
          <DotsHorizontalIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white shadow border border-gray-200 rounded p-1"
          sideOffset={4}
          align="end"
        >
          <DropdownMenu.Item
            onSelect={() => onShowChildren(category)}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            Show Info
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => showChildCategories(category.id)}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            Show Child Categories
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => onEdit(category)}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => onDelete(category.id, category.name)}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Delete
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => showCategoryTags(category.id)}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            Show Tags
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => onAddTag(category.id)}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            Add Tag
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => showCategoryQuestions(category.id)}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            Show Questions
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
