import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

interface Props {
  onEdit: () => void
  onDelete: () => void
}

export function CategoryQuestionActions({ onEdit, onDelete }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-2 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Actions"
        >
          <DotsVerticalIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[150px] bg-white border rounded shadow-md p-1 text-sm"
          sideOffset={4}
        >
          <DropdownMenu.Item
            onSelect={onEdit}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer"
          >
            <Pencil1Icon className="w-4 h-4" />
            Edit
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={onDelete}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
