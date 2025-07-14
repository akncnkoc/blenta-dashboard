import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  Question,
  useLazyGetAllQuestionFromCategoryQuery,
} from '@/services/api/question-api'
import { CategoryQuestioCreateModal } from './CategoryQuestionCreateModal'
import { CategoryQuestionActions } from './CategoryQuestionActions'
import { CategoryQuestionDeleteModal } from './CategoryQuestionDeleteModal'
import { CategoryQuestionUpdateModal } from './CategoryQuestionUpdateModal'

export default function CategoryQuestionsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  )
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  )
  const [getAllQuestions, { isLoading }] =
    useLazyGetAllQuestionFromCategoryQuery()

  const [questions, setQuestions] = useState<Question[]>([])

  const navigate = useNavigate()
  const params = useParams({ from: '/category/$id/questions', strict: true })

  useEffect(() => {
    if (!params.id) return
    getAllQuestions({ categoryId: params.id }).then((res) => {
      setQuestions(
        Array.isArray(res?.data?.questions) ? res.data.questions : [],
      )
    })
  }, [
    search,
    page,
    params.id,
    isCreateModalOpen,
    editModalOpen,
    deleteModalOpen,
  ])
  const columns: ColumnDef<Question>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'sort', header: 'Sort Order' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <CategoryQuestionActions
          onEdit={() => {
            setSelectedQuestion(row.original)
            setEditModalOpen(true)
          }}
          onDelete={() => {
            setSelectedQuestionId(row.original.id)
            setDeleteModalOpen(true)
          }}
        />
      ),
    },
  ]

  const table = useReactTable({
    data: questions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10, // You can change this
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function'
          ? updater(table.getState().pagination)
          : updater
      setPage(newState.pageIndex + 1)
    },
  })

  useEffect(() => {
    if (!params.id) {
      navigate({ to: '/category' })
    }
  }, [params.id, navigate])

  if (!params.id) return null

  return (
    <div className="p-4 w-full">
      <CategoryQuestioCreateModal
        open={isCreateModalOpen}
        onOpenChange={setCreateModalOpen}
        categoryId={params.id}
      />
      {selectedQuestion && (
        <CategoryQuestionUpdateModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          question={selectedQuestion}
        />
      )}

      {selectedQuestionId && (
        <CategoryQuestionDeleteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          questionId={selectedQuestionId}
        />
      )}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          className="border px-3 py-1 rounded w-full max-w-xs"
        />
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Question For Category
        </button>
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
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
