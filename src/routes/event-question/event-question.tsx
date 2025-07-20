import { useState, useEffect } from 'react'
import { EventQuestionPagination } from './EventQuestionPagination'
import { EventQuestionTable } from './EventQuestionTable'
import { EventQuestion } from '@/services/api/event-api'
import { EventQuestionSearchBar } from './EventQuestionSearchBar'
import { useLazyGetAllEventQuestionsQuery } from '@/services/api/event-question-api'
import { EventQuestionCreateModal } from './EventQuestionCreateModal'
import { EventQuestionEditModal } from './EventQuestionEditModal'
import { EventQuestionDeleteModal } from './EventQuestionDeleteModal'

export default function EventQuestionScreen() {
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState<'en' | 'tr'>('tr')
  const [page, setPage] = useState(1)
  const size = 10
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editedEventQuestionId, setEditedEventQuestionId] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [eventQuestionToDelete, setEventQuestionDelete] = useState<{
    id: string
    text: string
  } | null>(null)
  const [getAllEventQuestions, { isLoading }] =
    useLazyGetAllEventQuestionsQuery()
  const [events, setEvents] = useState<EventQuestion[]>([])
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    getAllEventQuestions({
      search: search || undefined,
      page: String(page),
      size: String(size),
      lang,
    }).then((res) => {
      if (res?.data) {
        setEvents(res.data.data)
        setTotalCount(res.data.meta.total)
      }
    })
  }, [search, page, lang, editOpen])

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <EventQuestionSearchBar
          search={search}
          lang={lang}
          onSearchChange={(val) => {
            setPage(1)
            setSearch(val)
          }}
          onLangChange={setLang}
        />
        <button
          onClick={() => setCreateOpen(true)}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Event Question
        </button>
      </div>

      <EventQuestionTable
        data={events}
        totalCount={totalCount}
        page={page}
        size={size}
        isLoading={isLoading}
        onPageChange={setPage}
        onEdit={(cat) => {
          setEditedEventQuestionId(cat.id)
          setEditOpen(true)
        }}
        onDelete={(id: string, text: string) => {
          setEventQuestionDelete({ id, text })
          setDeleteOpen(true)
        }}
      />

      <EventQuestionPagination
        page={page}
        size={size}
        total={totalCount}
        onPageChange={setPage}
      />

      <EventQuestionCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <EventQuestionEditModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditedEventQuestionId('')
        }}
        eventQuestionId={editedEventQuestionId}
      />
      {eventQuestionToDelete && (
        <EventQuestionDeleteModal
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open)
            if (!open) setEventQuestionDelete(null)
          }}
          eventQuestionId={eventQuestionToDelete.id}
          eventQuestionText={eventQuestionToDelete.text}
        />
      )}
    </div>
  )
}
