import { useState, useEffect } from 'react'
import { EventTagDeleteModal } from './EventTagDeleteModal'
import {
  EventTag,
  useLazyGetAllEventTagsQuery,
} from '@/services/api/event-tag-api'
import { EventTagSearchBar } from './EventTagSearchBar'
import { EventTagTable } from './EventTagTable'
import { EventTagEditModal } from './EvenTagEditModal'
import { EventTagCreateModal } from './EventTagCreateModal'
import { EventTagPagination } from './EventTagPagination'

export default function EventTagScreen() {
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState<'en' | 'tr'>('tr')
  const [page, setPage] = useState(1)
  const size = 10
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editedEventTagId, setEditedEventTagId] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [eventTagToDelete, setEventTagToDelete] = useState<{
    id: string
    name: string
  } | null>(null)
  const [getAllEventTags, { isLoading }] = useLazyGetAllEventTagsQuery()
  const [eventTags, setEventTags] = useState<EventTag[]>([])
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    getAllEventTags({
      search: search || undefined,
      page: String(page),
      size: String(size),
      lang,
    }).then((res) => {
      if (res?.data) {
        setEventTags(res.data.data)
        setTotalCount(res.data.meta.total)
      }
    })
  }, [search, page, lang, editOpen])

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <EventTagSearchBar
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
          + Add Event Tag
        </button>
      </div>

      <EventTagTable
        data={eventTags}
        totalCount={totalCount}
        page={page}
        size={size}
        isLoading={isLoading}
        onPageChange={setPage}
        onEdit={(cat) => {
          setEditedEventTagId(cat.id)
          setEditOpen(true)
        }}
        onDelete={(id: string, name: string) => {
          setEventTagToDelete({ id, name })
          setDeleteOpen(true)
        }}
      />

      <EventTagPagination
        page={page}
        size={size}
        total={totalCount}
        onPageChange={setPage}
      />

      <EventTagCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      <EventTagEditModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditedEventTagId('')
        }}
        eventTagId={editedEventTagId}
      />
      {eventTagToDelete && (
        <EventTagDeleteModal
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open)
            if (!open) setEventTagToDelete(null)
          }}
          eventTagId={eventTagToDelete.id}
          eventTagName={eventTagToDelete.name}
        />
      )}
    </div>
  )
}
