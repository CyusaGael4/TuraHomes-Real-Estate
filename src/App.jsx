import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const EditProperty = lazy(() => import('./pages/EditProperty'))
const Home = lazy(() => import('./pages/Home'))
const Listings = lazy(() => import('./pages/Listings'))
const Login = lazy(() => import('./pages/Login'))
const NewProperty = lazy(() => import('./pages/NewProperty'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const Signup = lazy(() => import('./pages/Signup'))

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(204,162,79,0.18),_transparent_28%),linear-gradient(180deg,_rgba(9,31,57,0.04),_rgba(255,248,238,0.92)_35%,_rgba(246,239,226,1)_100%)]" />
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AppLayout>
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
            <div className="rounded-full border border-[var(--color-line)] bg-white px-6 py-3 text-sm text-[var(--color-muted)] shadow-sm">
              Loading page...
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute agentOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/new"
            element={
              <ProtectedRoute agentOnly>
                <NewProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit/:id"
            element={
              <ProtectedRoute agentOnly>
                <EditProperty />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}
