import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { Category } from '@/services/api/category-api'
import { CategoryActionsMenu } from './CategoryActionsMenu'

interface Props {
  data: Category[]
  totalCount: number
  page: number
  size: number
  isLoading: boolean
  onPageChange: (page: number) => void
  onShowChildren: (cat: Category) => void
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
  onAddTag: (id: string) => void
  onAddQuestion: (id: string) => void
}

export function CategoryTable({
  data,
  totalCount,
  page,
  size,
  isLoading,
  onPageChange,
  onShowChildren,
  onEdit,
  onDelete,
  onAddTag,
  onAddQuestion,
}: Props) {
  const columns: ColumnDef<Category>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'color', header: 'Color' },
    { accessorKey: 'culture', header: 'Culture' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'isPremiumCat', header: 'Is Premium Category' },
    { accessorKey: 'isRefCat', header: 'Is Reference Category' },
    { accessorKey: 'questionCount', header: 'Question Count' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <CategoryActionsMenu
          category={row.original}
          onShowChildren={onShowChildren}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddTag={onAddTag}
          onAddQuestion={onAddQuestion}
        />
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / size),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: page - 1, pageSize: size }).pageIndex
          : updater.pageIndex
      onPageChange(next + 1)
    },
  })

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
