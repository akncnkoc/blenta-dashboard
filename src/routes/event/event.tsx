import { useState, useEffect } from 'react'
import { EventCreateModal } from './EventCreateModal'
import { EventPagination } from './EventPagination'
import { EventTable } from './EventTable'
import { Event, useLazyGetAllEventsQuery } from '@/services/api/event-api'
import { EventSearchBar } from './EventSearchBar'
import { EventEditModal } from './EventEditModal'
import { EventDeleteModal } from './EventDeleteModal'

export default function EventScreen() {
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState<'en' | 'tr'>('tr')
  const [page, setPage] = useState(1)
  const size = 10
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editedEventId, setEditedEventId] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<{
    id: string
    name: string
  } | null>(null)
  const [getAllEvents, { isLoading }] = useLazyGetAllEventsQuery()
  const [events, setEvents] = useState<Event[]>([])
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    getAllEvents({
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
        <EventSearchBar
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
          + Add Event
        </button>
      </div>

      <EventTable
        data={events}
        totalCount={totalCount}
        page={page}
        size={size}
        isLoading={isLoading}
        onPageChange={setPage}
        onEdit={(cat) => {
          setEditedEventId(cat.id)
          setEditOpen(true)
        }}
        onDelete={(id: string, name: string) => {
          setEventToDelete({ id, name })
          setDeleteOpen(true)
        }}
      />

      <EventPagination
        page={page}
        size={size}
        total={totalCount}
        onPageChange={setPage}
      />

      <EventCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      <EventEditModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditedEventId('')
        }}
        eventId={editedEventId}
      />
      {eventToDelete && (
        <EventDeleteModal
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open)
            if (!open) setEventToDelete(null)
          }}
          eventId={eventToDelete.id}
          eventName={eventToDelete.name}
        />
      )}
    </div>
  )
}
