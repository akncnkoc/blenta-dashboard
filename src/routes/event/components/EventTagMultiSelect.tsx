import { useEffect, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import { useFormikContext } from 'formik'

import {
  useLazyGetAllEventTagsQuery,
  type EventTag,
} from '@/services/api/event-tag-api'

export function EventTagMultiSelect({ lang }: { lang: string }) {
  const { values, setFieldValue } = useFormikContext<any>()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [eventTags, setEventTags] = useState<EventTag[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement | null>(null)

  const [trigger, result] = useLazyGetAllEventTagsQuery()

  const fetchTags = async (pageNumber = 1, searchText = '') => {
    const { data } = await trigger({
      page: String(pageNumber),
      size: String(10),
      search: searchText,
      lang,
    }).unwrap()

    if (pageNumber === 1) {
      setEventTags(data)
    } else {
      setEventTags((prev) => [...prev, ...data])
    }

    setHasMore(data.length >= 10)
  }

  useEffect(() => {
    if (open) {
      setPage(1)
      fetchTags(1, search)
    }
  }, [open, search])

  const onScroll = () => {
    if (!listRef.current || result.isFetching || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchTags(nextPage, search)
    }
  }
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.currentTarget.scrollBy({ top: e.deltaY, behavior: 'smooth' })
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-full border border-gray-300 px-3 py-2 rounded text-left bg-white"
        >
          {values.tagIds?.length > 0
            ? `${values.tagIds.length} tag(s) selected`
            : 'Select tags'}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 bg-white p-3 rounded shadow-lg w-64"
          sideOffset={5}
        >
          <input
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm"
          />

          <div
            ref={listRef}
            onWheel={onWheel}
            onScroll={onScroll}
            className="max-h-60 overflow-y-auto space-y-1 pr-1"
            style={{ maxHeight: 240 }}
          >
            {eventTags.map((tag) => {
              const checked = values.tagIds.includes(tag.id)
              return (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <Checkbox.Root
                    checked={checked}
                    onCheckedChange={(c) => {
                      const newTagIds = c
                        ? [...values.tagIds, tag.id]
                        : values.tagIds.filter((id: string) => id !== tag.id)
                      setFieldValue('tagIds', newTagIds)
                    }}
                    className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center data-[state=checked]:bg-blue-600"
                  >
                    <Checkbox.Indicator className="text-white">
                      <CheckIcon className="w-3 h-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="text-sm">
                    {tag.name} ({tag.culture})
                  </span>
                </label>
              )
            })}

            {result.isFetching && (
              <div className="text-center text-sm text-gray-500 py-2">
                Loading...
              </div>
            )}

            {!hasMore && !result.isFetching && (
              <div className="text-center text-xs text-gray-400 py-2">
                No more tags
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
