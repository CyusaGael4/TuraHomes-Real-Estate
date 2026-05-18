import { Bath, BedDouble, LandPlot, MapPin, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AgentCard from '../components/AgentCard'
import InquiryForm from '../components/InquiryForm'
import MapView from '../components/MapView'
import { supabase } from '../lib/supabase'

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

export default function PropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    const loadProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, agents(name, email, phone)')
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setProperty(data)
        setSelectedImage(data.images?.[0] || '')
      }

      setLoading(false)
    }

    loadProperty()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-[620px] animate-pulse rounded-[32px] bg-white/70" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-[var(--color-muted)]">
        This property could not be found.
      </div>
    )
  }

  const images = property.images?.length
    ? property.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80']

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-8">
          <div className="overflow-hidden rounded-[34px] border border-[var(--color-line)] bg-white shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
            <div className="relative h-[420px] w-full overflow-hidden">
              <img src={selectedImage || images[0]} alt={property.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,31,57,0.52)] via-transparent to-transparent" />
              <div className="absolute left-5 top-5 flex gap-2">
                <span className="rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-navy)]">
                  {property.type}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]">
                  {property.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={`overflow-hidden rounded-[20px] border-2 transition ${
                    selectedImage === image ? 'border-[var(--color-gold)]' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={property.title} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-[var(--color-line)] bg-white p-8 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-[var(--color-ink)]">{property.title}</h1>
                <p className="mt-3 flex items-center gap-2 text-[var(--color-muted)]">
                  <MapPin className="h-5 w-5 text-[var(--color-gold-deep)]" />
                  {property.location}, {property.city}
                </p>
              </div>
              <div className="rounded-[24px] bg-[var(--color-soft)] px-5 py-4">
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">Price</p>
                <p className="mt-1 text-3xl font-semibold text-[var(--color-navy)]">
                  {formatPrice(property.price, property.status)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-[28px] bg-[var(--color-soft)] p-5 sm:grid-cols-2 xl:grid-cols-5">
              <DetailPill icon={BedDouble} label="Bedrooms" value={property.bedrooms ?? '-'} />
              <DetailPill icon={Bath} label="Bathrooms" value={property.bathrooms ?? '-'} />
              <DetailPill icon={LandPlot} label="Area" value={`${property.area_sqm ?? '-'} sqm`} />
              <DetailPill icon={Tag} label="Status" value={property.status} />
              <DetailPill icon={Tag} label="Type" value={property.type} />
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-[var(--color-ink)]">Overview</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-[var(--color-muted)]">{property.description}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold text-[var(--color-ink)]">Location</h2>
            <MapView lat={property.lat} lng={property.lng} title={property.title} location={property.location} />
          </div>
        </section>

        <aside className="space-y-6">
          <AgentCard agent={property.agents} />
          <InquiryForm propertyId={property.id} />
        </aside>
      </div>
    </div>
  )
}

function DetailPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[22px] border border-white bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(204,162,79,0.12)] text-[var(--color-gold-deep)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">{label}</p>
          <p className="mt-1 font-semibold capitalize text-[var(--color-ink)]">{value}</p>
        </div>
      </div>
    </div>
  )
}
