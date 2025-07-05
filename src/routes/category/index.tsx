import { useState, useEffect } from 'react'
import {
  useLazyGetAllCategoriesQuery,
  type Category,
} from '@/services/api/category-api'
import { CategoryTable } from '@/routes/category/CategoryTable'
import { CategorySearchBar } from '@/routes/category//CategorySearchBar'
import { CategoryDetailsModal } from '@/routes/category/CategoryDetailsModal'
import { CategoryPagination } from '@/routes/category/CategoryPagination'
import { CategoryCreateModal } from '@/routes/category/CategoryCreateModal'
import { CategoryEditModal } from './CategoryEditModal'

export default function CategoryPage() {
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState<'en' | 'tr'>('tr')
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const size = 10
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editedCategoryId, setEditedCategoryId] = useState('')
  const [getAllCategories, { isLoading }] = useLazyGetAllCategoriesQuery()
  const [categories, setCategories] = useState<Category[]>([])
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    getAllCategories({
      search: search || undefined,
      page: String(page),
      size: String(size),
      lang,
    }).then((res) => {
      if (res?.data) {
        setCategories(res.data.data)
        setTotalCount(res.data.meta.total)
      }
    })
  }, [search, page, lang])

  useEffect(() => {
    if (!editedCategoryId) {
      setEditOpen(true)
    }
  }, [editedCategoryId])

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <CategorySearchBar
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
          + Add Category
        </button>
      </div>

      <CategoryTable
        data={categories}
        totalCount={totalCount}
        page={page}
        size={size}
        isLoading={isLoading}
        onPageChange={setPage}
        onShowChildren={setSelectedCategory}
        onEdit={(cat) => {
          setEditedCategoryId(cat.id)
        }}
        onDelete={(id) => console.log('Delete', id)}
        onAddTag={(id) => console.log('Add Tag', id)}
        onAddQuestion={(id) => console.log('Add Question', id)}
      />

      <CategoryPagination
        page={page}
        size={size}
        total={totalCount}
        onPageChange={setPage}
      />

      <CategoryDetailsModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
      <CategoryCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      <CategoryEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        categoryId={editedCategoryId}
      />
    </div>
  )
}
