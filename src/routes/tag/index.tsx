import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import {
  useLazyGetAllTagsQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useCreateTagMutation,
} from '@/services/api/tag-api' // adjust your path

type Tag = {
  id: string
  name: string
}

export default function Tag() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [getAllTags, { isLoading }] = useLazyGetAllTagsQuery()
  const [updateTag] = useUpdateTagMutation()
  const [deleteTag] = useDeleteTagMutation()

  const [tags, setTags] = useState<Tag[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const [editTag, setEditTag] = useState<Tag | null>(null)
  const [editName, setEditName] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const [createTag] = useCreateTagMutation()

  useEffect(() => {
    getAllTags({ search, page: String(page), size: String(pageSize) }).then(
      (res) => {
        if (res?.data) {
          setTags(res.data.data)
          setTotalCount(res.data.meta.total)
        }
      },
    )
  }, [search, page])

  const handleSaveEdit = async () => {
    if (editTag) {
      await updateTag({ id: editTag.id, name: editName })
      setEditTag(null)
      getAllTags({ search, page: String(page), size: String(pageSize) }) // refresh data
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      await deleteTag(id)
      getAllTags({ search, page: String(page), size: String(pageSize) }) // refresh
    }
  }

  const columns: ColumnDef<Tag>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const tag = row.original
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
              >
                <DropdownMenu.Item
                  onSelect={() => {
                    setEditTag(tag)
                    setEditName(tag.name)
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => handleDelete(tag.id)}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )
      },
    },
  ]

  const table = useReactTable({
    data: tags,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPageIndex =
        typeof updater === 'function'
          ? updater({ pageIndex: page - 1, pageSize }).pageIndex
          : updater.pageIndex
      setPage(newPageIndex + 1)
    },
  })

  return (
    <div className="p-4 w-full">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search tags..."
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          className="border px-3 py-1 rounded w-full max-w-xs"
        />
        <Dialog.Root open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <Dialog.Trigger asChild>
            <button className="ml-4 px-4 py-2 bg-green-600 text-white rounded">
              + New Tag
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold mb-2">
                Create New Tag
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mb-4">
                Enter a name for the new tag.
              </Dialog.Description>
              <input
                className="w-full border px-3 py-2 rounded mb-4"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 border rounded">Cancel</button>
                </Dialog.Close>
                <button
                  onClick={async () => {
                    if (!newTagName.trim()) return
                    await createTag({ name: newTagName.trim() })
                    setNewTagName('')
                    setCreateDialogOpen(false)
                    getAllTags({
                      search,
                      page: String(page),
                      size: String(pageSize),
                    }) // refresh list
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Create
                </button>
              </div>
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 text-gray-500 hover:text-black">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left px-4 py-2 border-b">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No results found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(totalCount / pageSize)}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page * pageSize >= totalCount}
        >
          Next
        </button>
      </div>

      {/* Edit Tag Modal */}
      <Dialog.Root
        open={!!editTag}
        onOpenChange={(open) => !open && setEditTag(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Edit Tag
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Modify the tag name and save your changes.
            </Dialog.Description>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button className="px-4 py-2 border rounded">Cancel</button>
              </Dialog.Close>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
