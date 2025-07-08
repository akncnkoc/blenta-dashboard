import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useLazyGetAllCategoryTagsQuery } from '@/services/api/tag-api' // adjust your path
import { useNavigate, useParams } from '@tanstack/react-router'

type Tag = {
  id: string
  name: string
}

export default function CategoryTagsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [getAllTags, { isLoading }] = useLazyGetAllCategoryTagsQuery()

  const [tags, setTags] = useState<Tag[]>([])

  const navigate = useNavigate()

  const params = useParams({ from: '/category/$id/tags', strict: true })

  useEffect(() => {
    if (!params.id) return
    getAllTags({ categoryId: params.id }).then((res) => {
      // res.data.data kesinlikle array değilse fallback ver
      setTags(Array.isArray(res?.data?.data) ? res.data.data : [])
    })
  }, [search, page, params.id])

  const columns: ColumnDef<Tag>[] = [{ accessorKey: 'name', header: 'Name' }]

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
