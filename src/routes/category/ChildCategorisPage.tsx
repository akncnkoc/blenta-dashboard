import { useState, useMemo } from 'react'
import { useGetCategoryQuery, type Category } from '@/services/api/category-api'
import { CategoryTable } from '@/routes/category/CategoryTable'
import { CategorySearchBar } from '@/routes/category/CategorySearchBar'
import { CategoryDetailsModal } from '@/routes/category/CategoryDetailsModal'
import { CategoryPagination } from '@/routes/category/CategoryPagination'
import { CategoryCreateModal } from '@/routes/category/CategoryCreateModal'
import { CategoryEditModal } from './CategoryEditModal'
import { CategoryAddTagModal } from './CategoryAddTagModal'
import { CategoryDeleteModal } from './CategoryDeleteModal'
import { useNavigate, useParams } from '@tanstack/react-router'

export default function ChildCategoriesPage() {
  const navigate = useNavigate()
  const { categoryId } = useParams({ from: '/category/$categoryId' })
  const {
    data: parentCategory,
    isLoading,
    error,
  } = useGetCategoryQuery(categoryId)
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState<'en' | 'tr'>('tr') // optional if you want to filter lang client side
  const [page, setPage] = useState(1)
  const size = 10

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editedCategoryId, setEditedCategoryId] = useState('')
  const [addTagOpen, setAddTagOpen] = useState(false)
  const [tagCategoryId, setTagCategoryId] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  // filter childCategories by search & lang (if needed)
  const filteredChildren = useMemo(() => {
    if (!parentCategory?.childCategories) return []

    return parentCategory.childCategories.filter((cat: Category) => {
      const matchesSearch = cat.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesLang = lang ? cat.culture === lang : true
      return matchesSearch && matchesLang
    })
  }, [parentCategory, search, lang])

  // paginate filtered children
  const pagedChildren = useMemo(() => {
    const start = (page - 1) * size
    return filteredChildren.slice(start, start + size)
  }, [filteredChildren, page, size])

  // total count for pagination
  const totalCount = filteredChildren.length

  if (isLoading) return <div>Loading...</div>
  if (error || !parentCategory) return <div>Error loading category</div>

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-4">
        Parent Category: {parentCategory.name}
      </h2>

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
          + Add Subcategory
        </button>
      </div>

      <CategoryTable
        showChildCategories={(catId) => {
          navigate({
            to: '/category/$categoryId',
            params: { categoryId: catId },
          })
        }}
        data={pagedChildren}
        totalCount={totalCount}
        page={page}
        size={size}
        isLoading={false} // no server loading here, you can enhance if you want
        onPageChange={setPage}
        onShowChildren={setSelectedCategory}
        onEdit={(cat) => {
          setEditedCategoryId(cat.id)
          setEditOpen(true)
        }}
        showCategoryTags={(categoryId) => {
          navigate({
            to: '/category/$id/tags',
            params: { id: categoryId },
          })
        }}
        showCategoryQuestions={(categoryId) => {
          navigate({
            to: '/category/$id/questions',
            params: { id: categoryId },
          })
        }}
        onDelete={(id: string, name: string) => {
          setCategoryToDelete({ id, name })
          setDeleteOpen(true)
        }}
        onAddTag={(id) => {
          setTagCategoryId(id)
          setAddTagOpen(true)
        }}
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

      <CategoryCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        parentCategoryCulture={parentCategory.culture}
      />

      <CategoryEditModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditedCategoryId('')
        }}
        categoryId={editedCategoryId}
      />

      <CategoryAddTagModal
        open={addTagOpen}
        onOpenChange={(open) => {
          setAddTagOpen(open)
          if (!open) setTagCategoryId('')
        }}
        categoryId={tagCategoryId}
      />

      {categoryToDelete && (
        <CategoryDeleteModal
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open)
            if (!open) setCategoryToDelete(null)
          }}
          categoryId={categoryToDelete.id}
          categoryName={categoryToDelete.name}
        />
      )}
    </div>
  )
}
