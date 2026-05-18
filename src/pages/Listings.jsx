import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import PropertyCard from '../components/PropertyCard'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 12

function normalizeFilters(searchParams) {
  return {
    bedrooms: searchParams.get('bedrooms') || 'all',
    city: searchParams.get('city') || 'all',
    maxPrice: searchParams.get('maxPrice') || '',
    minPrice: searchParams.get('minPrice') || '',
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
    type: searchParams.get('type') || 'all',
  }
}

export default function Listings() {
  const [properties, setProperties] = useState([])
  const [cities, setCities] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => normalizeFilters(searchParams), [searchParams])
  const currentPage = Math.max(Number(searchParams.get('page') || '1'), 1)

  useEffect(() => {
    let active = true

    const loadCities = async () => {
      const { data, error } = await supabase.from('properties').select('city').limit(2000)

      if (error) {
        console.error(error)
        return
      }

      if (active) {
        setCities([...new Set((data || []).map((property) => property.city).filter(Boolean))].sort())
      }
    }

    loadCities()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadProperties = async () => {
      setLoading(true)
      const from = (currentPage - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (filters.search.trim()) {
        const escapedSearch = filters.search.trim().replaceAll(',', ' ')
        query = query.or(
          `title.ilike.%${escapedSearch}%,city.ilike.%${escapedSearch}%,location.ilike.%${escapedSearch}%`,
        )
      }

      if (filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.city !== 'all') {
        query = query.eq('city', filters.city)
      }

      if (filters.bedrooms !== 'all') {
        query =
          filters.bedrooms === '5+'
            ? query.gte('bedrooms', 5)
            : query.eq('bedrooms', Number(filters.bedrooms))
      }

      if (filters.minPrice) {
        query = query.gte('price', Number(filters.minPrice))
      }

      if (filters.maxPrice) {
        query = query.lte('price', Number(filters.maxPrice))
      }

      const { data, error, count } = await query

      if (error) {
        console.error(error)
        if (active) {
          setProperties([])
          setTotalCount(0)
        }
      } else if (active) {
        setProperties(data || [])
        setTotalCount(count || 0)
      }

      if (active) {
        setLoading(false)
      }
    }

    loadProperties()

    return () => {
      active = false
    }
  }, [currentPage, filters])

  const totalPages = useMemo(() => Math.max(Math.ceil(totalCount / PAGE_SIZE), 1), [totalCount])

  const updateFilter = (key, value) => {
    const nextFilters = { ...filters, [key]: value }

    const nextParams = new URLSearchParams()
    nextParams.set('page', '1')
    Object.entries(nextFilters).forEach(([entryKey, entryValue]) => {
      if (entryValue && entryValue !== 'all') {
        nextParams.set(entryKey, entryValue)
      }
    })
    setSearchParams(nextParams)
  }

  const resetFilters = () => {
    setSearchParams({})
  }

  const goToPage = (page) => {
    const nextParams = new URLSearchParams(searchParams)
    if (page <= 1) {
      nextParams.delete('page')
    } else {
      nextParams.set('page', String(page))
    }
    setSearchParams(nextParams)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[36px] border border-[var(--color-line)] bg-[linear-gradient(135deg,_rgba(9,31,57,1),_rgba(35,58,93,0.92))] px-6 py-10 text-white shadow-[0_24px_80px_rgba(8,21,42,0.22)] sm:px-10">
        <p className="section-kicker !text-[var(--color-gold-light)]">Find Your Match</p>
        <h1 className="mt-3 text-4xl font-semibold">Explore every TuraHomes listing in one place.</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Narrow the search with flexible filters, compare neighborhoods, and move from browsing to inquiry in a few taps.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[30px] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
            <h2 className="text-xl font-semibold text-[var(--color-ink)]">Refine Results</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Filter by type, location, budget, and room count.</p>
          </div>
          <FilterBar showPrice mode="sidebar" filters={filters} cities={cities} onChange={updateFilter} />
          <button type="button" className="btn-secondary w-full justify-center" onClick={resetFilters}>
            Reset Filters
          </button>
        </aside>

        <section>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <label className="field-shell max-w-2xl flex-1">
              <span className="field-label">Search listings</span>
              <div className="field-with-icon">
                <Search className="field-icon" />
                <input
                  type="text"
                  className="field-input field-input-with-icon"
                  placeholder="Search by title, city, or location"
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                />
              </div>
            </label>
            <div className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm text-[var(--color-muted)] shadow-sm">
              {loading ? 'Loading...' : `${totalCount} properties found`}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-[420px] animate-pulse rounded-[28px] bg-white/70" />
              ))}
            </div>
          ) : properties.length ? (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-[var(--color-line)] bg-white/70 px-8 py-16 text-center text-[var(--color-muted)]">
              No listings match the current filters yet.
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-muted)]">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
