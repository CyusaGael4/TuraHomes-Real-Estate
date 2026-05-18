import { Menu, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Listings', to: '/listings' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAgent, signOut, user } = useAuth()
  const navigate = useNavigate()
  const displayName =
    user?.user_metadata?.name ||
    user?.identities?.[0]?.identity_data?.name ||
    user?.email?.split('@')[0] ||
    'Account'

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(9,31,57,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/brand/turahomes-logo.png"
            alt="TuraHomes Real Estate"
            className="h-12 w-auto rounded-md object-contain"
          />
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-[0.08em] text-white">TuraHomes Real Estate</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
              Homes Across Thousand Hills of Rwanda
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--color-gold)] text-[var(--color-navy)]'
                    : 'text-white hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAgent && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--color-gold)] text-[var(--color-navy)]'
                    : 'text-white hover:bg-white/10 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-2 text-sm text-white/85">
                <UserRound className="h-4 w-4" />
                {displayName}
              </span>
              <button className="btn-secondary" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white transition hover:text-[var(--color-gold-light)]">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-full border border-white/15 p-2 text-white md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[rgba(9,31,57,0.98)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[var(--color-gold)] text-[var(--color-navy)]'
                      : 'text-white hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAgent && (
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[var(--color-gold)] text-[var(--color-navy)]'
                      : 'text-white hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}
            {user ? (
              <button type="button" className="btn-secondary mt-2" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-2xl px-4 py-3 text-sm font-medium text-white">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
