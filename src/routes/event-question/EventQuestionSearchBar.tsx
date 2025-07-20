interface Props {
  search: string
  lang: 'tr' | 'en'
  onSearchChange: (s: string) => void
  onLangChange: (l: 'tr' | 'en') => void
}

export function EventQuestionSearchBar({
  search,
  lang,
  onSearchChange,
  onLangChange,
}: Props) {
  return (
    <div className="mb-4 flex gap-2 items-center">
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />
      <select
        value={lang}
        onChange={(e) => onLangChange(e.target.value as 'tr' | 'en')}
        className="border px-2 py-1 rounded"
      >
        <option value="en">EN</option>
        <option value="tr">TR</option>
      </select>
    </div>
  )
}
