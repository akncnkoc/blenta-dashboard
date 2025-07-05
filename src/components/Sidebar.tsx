import { Link, useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react' // Optional: for icons

export default function Sidebar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate({ to: '/login' })
  }

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <div className="text-2xl font-semibold mb-6">Blenta Dashboard</div>
      <nav className="flex flex-col gap-4 text-base">
        <Link
          to="/"
          className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded transition"
        >
          Home
        </Link>
        <Link
          to="/category"
          className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded transition"
        >
          Category
        </Link>
        <Link
          to="/tag"
          className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded transition"
        >
          Tag
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded transition"
        >
          Questions
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-left hover:bg-red-600 px-3 py-2 rounded transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  )
}
