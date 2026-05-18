import { Bath, BedDouble, LandPlot, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatPrice(price, status) {
  if (!price && price !== 0) {
    return 'Price on request'
  }

  const base = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)

  return status === 'for rent' ? `${base}/mo` : base
}

export default function PropertyCard({ property }) {
  const cover = property.images?.[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'

  return (
    <Link
      to={`/listings/${property.id}`}
      className="group overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white shadow-[0_18px_55px_rgba(8,21,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(8,21,42,0.14)]"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={cover}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,31,57,0.68)] via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy)]">
            {property.type}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
            {property.status}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-2xl font-semibold text-white">{formatPrice(property.price, property.status)}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--color-ink)]">{property.title}</h3>
          <p className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <MapPin className="h-4 w-4 text-[var(--color-gold-deep)]" />
            {property.location}, {property.city}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[var(--color-soft)] px-4 py-3 text-sm text-[var(--color-muted)]">
          <span className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-[var(--color-navy)]" />
            {property.bedrooms ?? '-'} bd
          </span>
          <span className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-[var(--color-navy)]" />
            {property.bathrooms ?? '-'} ba
          </span>
          <span className="flex items-center gap-2">
            <LandPlot className="h-4 w-4 text-[var(--color-navy)]" />
            {property.area_sqm ?? '-'} sqm
          </span>
        </div>
      </div>
    </Link>
  )
}
