import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useLazyGetAllUsersQuery, User } from '@/services/api/user-api'
import moment from 'moment'

export default function UserScreen() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [getAllUsers, { isLoading }] = useLazyGetAllUsersQuery()

  const [appVersions, setAppVersions] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const loadData = () => {
    getAllUsers({
      search,
      page: String(page),
      size: String(pageSize),
    }).then((res) => {
      if (res?.data) {
        setAppVersions(res.data.data)
        setTotalCount(res.data.meta.total)
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [search, page])

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'surname', header: 'Surname' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phoneNumber', header: 'Phone Number' },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: (val) => moment(val.getValue() ?? '').fromNow(),
    },
    // {
    //   id: 'actions',
    //   header: '',
    //   cell: ({ row }) => {
    //     const appVersion = row.original
    //     return (
    //       <DropdownMenu.Root>
    //         <DropdownMenu.Trigger asChild>
    //           <button className="p-2 rounded hover:bg-gray-100">
    //             <DotsHorizontalIcon />
    //           </button>
    //         </DropdownMenu.Trigger>
    //         <DropdownMenu.Portal>
    //           <DropdownMenu.Content
    //             className="min-w-[160px] bg-white shadow border border-gray-200 rounded p-1"
    //             sideOffset={4}
    //           >
    //             <DropdownMenu.Item
    //               onSelect={() => handleDelete(appVersion.id)}
    //               className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
    //             >
    //               Delete
    //             </DropdownMenu.Item>
    //           </DropdownMenu.Content>
    //         </DropdownMenu.Portal>
    //       </DropdownMenu.Root>
    //     )
    //   },
    // },
  ]

  const table = useReactTable({
    data: appVersions,
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
          placeholder="Search app versions..."
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
    </div>
  )
}
