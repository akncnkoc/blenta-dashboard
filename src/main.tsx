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
import CategoryTagsPage from './routes/category/CategoryTagsPage'
import CategoryQuestionsPage from './routes/category/CategoryQuestionsPage'
import ChildCategoriesPage from './routes/category/ChildCategorisPage'
import PromotionCodeScreen from './routes/promotion-code'
import AppVersionScreen from './routes/app-version'
import EventTagScreen from './routes/event-tag/event-tag'
import EventScreen from './routes/event/event'

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
const categoryChildRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryId',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <ChildCategoriesPage />
      </div>
    </ProtectedRoute>
  ),
})
const categoryTagRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$id/tags',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <CategoryTagsPage />
      </div>
    </ProtectedRoute>
  ),
})
const categoryQuestionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$id/questions',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <CategoryQuestionsPage />
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

const eventTagRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/event-tag',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <EventTagScreen />
      </div>
    </ProtectedRoute>
  ),
})

const eventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/event',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <EventScreen />
      </div>
    </ProtectedRoute>
  ),
})
const promotionCodeRoutes = createRoute({
  getParentRoute: () => rootRoute,
  path: '/promotion-code',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <PromotionCodeScreen />
      </div>
    </ProtectedRoute>
  ),
})
const appVersionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app-version',
  component: () => (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <AppVersionScreen />
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
  categoryChildRoute,
  categoryTagRoute,
  categoryQuestionRoute,
  tagRoute,
  promotionCodeRoutes,
  appVersionRoute,
  loginRoute,
  eventRoute,
  eventTagRoute,
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
