import { ArrowRight, Building2, House, Landmark, Search, Warehouse } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import { supabase } from '../lib/supabase'

const heroBackgrounds = Object.values(
  import.meta.glob('../assets/bgpics/*.{png,jpg,jpeg,avif,webp}', {
    eager: true,
    import: 'default',
  }),
)

const spotlightStats = [
  { label: 'Verified listings', value: '320+' },
  { label: 'Cities covered', value: '18' },
  { label: 'Agent partners', value: '74' },
]

const typeIcons = {
  apartment: Building2,
  commercial: Warehouse,
  house: House,
  land: Landmark,
}

const initialFilters = {
  bedrooms: 'all',
  city: 'all',
  maxPrice: '',
  minPrice: '',
  search: '',
  status: 'all',
  type: 'all',
}

export default function Home() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(initialFilters)
  const [activeBackground, setActiveBackground] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error(error)
      } else {
        setProperties(data || [])
      }

      setLoading(false)
    }

    loadProperties()
  }, [])

  useEffect(() => {
    if (heroBackgrounds.length <= 1) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setActiveBackground((current) => (current + 1) % heroBackgrounds.length)
    }, 4200)

    return () => window.clearInterval(interval)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      }
    })

    navigate(`/listings?${params.toString()}`)
  }

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroBackgrounds.map((image, index) => (
            <div
              key={image}
              className={`hero-swipe-bg absolute inset-0 bg-cover bg-center ${
                index === activeBackground ? 'hero-swipe-bg-active' : 'hero-swipe-bg-idle'
              }`}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(9,31,57,0.82), rgba(9,31,57,0.5)), url(${image})`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(204,162,79,0.35),_transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="animate-fade-up max-w-4xl lg:max-w-3xl xl:max-w-[880px]">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-light)]">
              Find your next address with confidence
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
              Premium homes, rentals, and investment spaces across Rwanda.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/72 sm:text-base lg:text-[1.02rem]">
              TuraHomes brings elegant discovery, trusted agents, and location-first browsing into one refined
              property experience.
            </p>

            <div className="mt-6 space-y-4 lg:pr-24 xl:pr-32">
              <div className="grid gap-3 sm:grid-cols-3">
                {spotlightStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <p className="text-2xl font-semibold text-white lg:text-[1.85rem]">{item.value}</p>
                    <p className="mt-1 text-xs text-white/70 sm:text-sm">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="animate-fade-up animation-delay-200 max-w-4xl rounded-[28px] border border-white/12 bg-white/94 p-4 shadow-[0_25px_80px_rgba(4,12,24,0.28)] backdrop-blur-xl sm:p-5">
                <div className="rounded-[26px] border border-[var(--color-line)] bg-[rgba(251,247,239,0.88)] p-4">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1.55fr)_200px_190px] md:items-end">
                    <label className="field-shell">
                      <span className="field-label">Search</span>
                      <input
                        type="text"
                        className="field-input min-w-0"
                        placeholder="Search"
                        value={filters.search}
                        onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                      />
                    </label>

                    <label className="field-shell">
                      <span className="field-label">Type</span>
                      <select
                        className="field-input"
                        value={filters.type}
                        onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
                      >
                        <option value="all">All types</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </label>

                    <button
                      type="button"
                      className="btn-primary h-[54px] w-full justify-center px-5 md:w-auto"
                      onClick={handleSearch}
                    >
                      <Search className="h-4 w-4" />
                      Search Listings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Property Types</p>
            <h2 className="section-title">Browse by the kind of space you need.</h2>
          </div>
          <Link to="/listings" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-navy)]">
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {['house', 'apartment', 'land', 'commercial'].map((type) => {
            const Icon = typeIcons[type]

            return (
              <Link
                key={type}
                to={`/listings?type=${encodeURIComponent(type)}`}
                className="group rounded-[28px] border border-[var(--color-line)] bg-white p-6 shadow-[0_16px_45px_rgba(8,21,42,0.08)] transition hover:-translate-y-1 hover:bg-[var(--color-navy)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(204,162,79,0.18)] text-[var(--color-gold-deep)] transition group-hover:bg-white/12 group-hover:text-[var(--color-gold-light)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold capitalize text-[var(--color-ink)] transition group-hover:text-white">
                  {type}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)] transition group-hover:text-white/70">
                  Explore curated {type} opportunities with detailed pricing, location, and agent support.
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Featured Collection</p>
            <h2 className="section-title">The latest listings making moves right now.</h2>
          </div>
          <Link to="/listings" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-navy)]">
            Explore all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-[28px] bg-white/70" />
            ))}
          </div>
        ) : properties.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-dashed border-[var(--color-line)] bg-white/70 p-10 text-center text-[var(--color-muted)]">
            No properties are available yet. Add your first listing from the dashboard.
          </div>
        )}
      </section>
    </div>
  )
}
