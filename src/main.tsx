// main.tsx or router setup file
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import './styles.css'
import Login from './routes/unprotected-routes/login'
import ProtectedRoute from './components/ProtectedRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from './components/ui/sonner'
import Home from './routes/home'
import Sidebar from './components/Sidebar'
import Category from './routes/category'
import Tag from './routes/tag'

const rootRoute = createRootRoute({
  component: () => (
    <Provider store={store}>
      <Toaster className="z-[9999]" />
      <Outlet />
    </Provider>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <Home />
      </div>
    </ProtectedRoute>
  ),
})

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <Category />
      </div>
    </ProtectedRoute>
  ),
})
const tagRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tag',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <Tag />
      </div>
    </ProtectedRoute>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  tagRoute,
  loginRoute,
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
const queryClient = new QueryClient()

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
