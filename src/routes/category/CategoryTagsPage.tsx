import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import {
  CategoryTag,
  useLazyGetAllCategoryTagsQuery,
} from '@/services/api/tag-api' // adjust your path
import { useNavigate, useParams } from '@tanstack/react-router'
import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import { CategoryTagDeleteModal } from './CategoryTagDeleteModal'

type Tag = {
  id: string
  name: string
}

export default function CategoryTagsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategoryTagId, setSelectedCategoryTagId] = useState('')
  const pageSize = 10

  const [getAllTags, { isLoading }] = useLazyGetAllCategoryTagsQuery()

  const [tags, setTags] = useState<CategoryTag[]>([])

  const navigate = useNavigate()

  const params = useParams({ from: '/category/$id/tags', strict: true })

  useEffect(() => {
    if (!params.id) return
    getAllTags({ categoryId: params.id }).then((res) => {
      console.log(res)
      // res.data.data kesinlikle array değilse fallback ver
      setTags(Array.isArray(res?.data?.tags) ? res?.data?.tags : [])
    })
  }, [search, page, params.id])

  const handleOpenDeleteModal = (categoryTagId: string) => {
    setSelectedCategoryTagId(categoryTagId)
    setDeleteModalOpen(true)
  }

  const columns: ColumnDef<CategoryTag>[] = [
    { accessorKey: 'name', header: 'Name' },

    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
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
                onSelect={() =>
                  handleOpenDeleteModal(row.original.categoryTagId)
                }
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ),
    },
  ]

  const table = useReactTable({
    data: tags || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (!params.id) {
      navigate({ to: '/category' })
    }
  }, [params.id, navigate])

  if (!params.id) return null
  return (
    <div className="p-4 w-full">
      {selectedCategoryTagId && (
        <CategoryTagDeleteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          categoryTagId={selectedCategoryTagId}
        />
      )}
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
    </div>
  )
}
