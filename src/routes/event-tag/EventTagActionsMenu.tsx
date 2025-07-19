import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { EventTag } from '@/services/api/event-tag-api'

interface Props {
  eventTag: EventTag
  onEdit: (cat: EventTag) => void
  onDelete: (id: string, name: string) => void
}

export function EventTagActionsMenu({ eventTag, onEdit, onDelete }: Props) {
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
            onSelect={() => onEdit(eventTag)}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => onDelete(eventTag.id, eventTag.name)}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
