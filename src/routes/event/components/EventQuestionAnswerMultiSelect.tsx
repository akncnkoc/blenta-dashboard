import { useEffect, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import { useFormikContext } from 'formik'
import { useLazyGetAllAnswersQuery } from '@/services/api/event-question-answer-api'
import type { EventQuestionAnswer } from '@/services/api/event-api'

export function EventQuestionAnswerMultiSelect({
  questionId,
}: {
  questionId?: string
}) {
  const { values, setFieldValue } = useFormikContext<any>()
  const [open, setOpen] = useState(false)
  const [answers, setAnswers] = useState<EventQuestionAnswer[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const size = 10
  const listRef = useRef<HTMLDivElement | null>(null)

  const [trigger, result] = useLazyGetAllAnswersQuery()

  const fetchAnswers = async (pageNumber = 1) => {
    const res = await trigger({
      page: String(pageNumber),
      size: String(size),
      questionId,
    }).unwrap()

    const newAnswers = res.data
    const total = res.meta.total

    if (pageNumber === 1) {
      setAnswers(newAnswers)
    } else {
      setAnswers((prev) => [...prev, ...newAnswers])
    }

    setHasMore(pageNumber * size < total)
  }

  useEffect(() => {
    if (open) {
      setPage(1)
      fetchAnswers(1)
    }
  }, [open, questionId])

  const onScroll = () => {
    if (!listRef.current || result.isFetching || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchAnswers(nextPage)
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
          {values.answerIds?.length > 0
            ? `${values.answerIds.length} answer(s) selected`
            : 'Select answers'}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 bg-white p-3 rounded shadow-lg w-64"
          sideOffset={5}
        >
          <div
            ref={listRef}
            onWheel={onWheel}
            onScroll={onScroll}
            className="max-h-60 overflow-y-auto space-y-1 pr-1"
            style={{ maxHeight: 240 }}
          >
            {answers.map((answer) => {
              const checked = values.answerIds?.includes(answer.id) ?? false
              return (
                <label
                  key={answer.id}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <Checkbox.Root
                    checked={checked}
                    onCheckedChange={(c) => {
                      const newAnswerIds = c
                        ? [...(values.answerIds ?? []), answer.id]
                        : (values.answerIds ?? []).filter(
                            (id: string) => id !== answer.id,
                          )
                      setFieldValue('answerIds', newAnswerIds)
                    }}
                    className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center data-[state=checked]:bg-blue-600"
                  >
                    <Checkbox.Indicator className="text-white">
                      <CheckIcon className="w-3 h-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="text-sm">{answer.text}</span>
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
                No more answers
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
