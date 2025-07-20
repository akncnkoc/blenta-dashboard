interface Props {
  page: number
  total: number
  size: number
  onPageChange: (page: number) => void
}

export function EventQuestionPagination({
  page,
  total,
  size,
  onPageChange,
}: Props) {
  const pageCount = Math.ceil(total / size)

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <span>
        Page {page} of {pageCount}
      </span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        Next
      </button>
    </div>
  )
}
