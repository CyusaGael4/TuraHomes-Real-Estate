import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ImageUploader from '../components/ImageUploader'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'

const emptyForm = {
  area_sqm: '',
  bathrooms: '',
  bedrooms: '',
  city: '',
  description: '',
  images: [],
  lat: '',
  lng: '',
  location: '',
  price: '',
  status: 'for sale',
  title: '',
  type: 'house',
}

export default function EditProperty() {
  const { id } = useParams()
  const { agentRecord } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('agent_id', agentRecord.id)
        .single()

      if (error) {
        setErrorMessage(error.message)
      } else {
        setForm({
          ...data,
          area_sqm: data.area_sqm ?? '',
          bathrooms: data.bathrooms ?? '',
          bedrooms: data.bedrooms ?? '',
          images: data.images ?? [],
          lat: data.lat ?? '',
          lng: data.lng ?? '',
          price: data.price ?? '',
        })
      }

      setLoading(false)
    }

    if (agentRecord?.id) {
      loadProperty()
    }
  }, [agentRecord, id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    const payload = {
      ...form,
      area_sqm: toNumberOrNull(form.area_sqm),
      bathrooms: toNumberOrNull(form.bathrooms),
      bedrooms: toNumberOrNull(form.bedrooms),
      lat: toNumberOrNull(form.lat),
      lng: toNumberOrNull(form.lng),
      price: toNumberOrNull(form.price),
    }

    const { error } = await supabase.from('properties').update(payload).eq('id', id)

    if (error) {
      setErrorMessage(error.message)
      setSubmitting(false)
      return
    }

    navigate(`/listings/${id}`)
  }

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[34px] border border-[var(--color-line)] bg-white p-8 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
        <p className="section-kicker">Property Editor</p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--color-ink)]">Edit property</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          Update listing details, pricing, map coordinates, and gallery images.
        </p>

        {loading ? (
          <div className="mt-8 h-[420px] animate-pulse rounded-[26px] bg-[var(--color-soft)]" />
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Title">
                <input required className="field-input" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
              </FormField>
              <FormField label="Price">
                <input required type="number" className="field-input" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
              </FormField>
              <FormField label="Type">
                <select className="field-input" value={form.type} onChange={(event) => updateField('type', event.target.value)}>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </FormField>
              <FormField label="Status">
                <select className="field-input" value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                  <option value="for sale">For sale</option>
                  <option value="for rent">For rent</option>
                </select>
              </FormField>
              <FormField label="Bedrooms">
                <input type="number" className="field-input" value={form.bedrooms} onChange={(event) => updateField('bedrooms', event.target.value)} />
              </FormField>
              <FormField label="Bathrooms">
                <input type="number" className="field-input" value={form.bathrooms} onChange={(event) => updateField('bathrooms', event.target.value)} />
              </FormField>
              <FormField label="Area (sqm)">
                <input type="number" className="field-input" value={form.area_sqm} onChange={(event) => updateField('area_sqm', event.target.value)} />
              </FormField>
              <FormField label="City">
                <input required className="field-input" value={form.city} onChange={(event) => updateField('city', event.target.value)} />
              </FormField>
              <FormField label="Location">
                <input required className="field-input" value={form.location} onChange={(event) => updateField('location', event.target.value)} />
              </FormField>
              <FormField label="Latitude">
                <input required type="number" step="any" className="field-input" value={form.lat} onChange={(event) => updateField('lat', event.target.value)} />
              </FormField>
              <FormField label="Longitude">
                <input required type="number" step="any" className="field-input" value={form.lng} onChange={(event) => updateField('lng', event.target.value)} />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea
                required
                rows="6"
                className="field-input resize-none"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
            </FormField>

            <div>
              <p className="field-label mb-3">Images</p>
              <ImageUploader value={form.images} onChange={(images) => updateField('images', images)} />
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Property'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <label className="field-shell">
      <span className="field-label">{label}</span>
      {children}
    </label>
  )
}

function toNumberOrNull(value) {
  return value === '' ? null : Number(value)
}
