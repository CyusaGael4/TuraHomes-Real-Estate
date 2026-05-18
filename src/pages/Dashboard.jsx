import { Building2, MailQuestion, Plus, SquarePen, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { agentRecord } = useAuth()
  const [properties, setProperties] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!agentRecord?.id) {
      return
    }

    const loadDashboard = async () => {
      setLoading(true)

      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', agentRecord.id)
        .order('created_at', { ascending: false })

      if (propertyError) {
        console.error(propertyError)
        setLoading(false)
        return
      }

      setProperties(propertyData || [])

      const propertyIds = (propertyData || []).map((property) => property.id)

      if (!propertyIds.length) {
        setInquiries([])
        setLoading(false)
        return
      }

      const { data: inquiryData, error: inquiryError } = await supabase
        .from('inquiries')
        .select('*, properties(title)')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })

      if (inquiryError) {
        console.error(inquiryError)
      } else {
        setInquiries(inquiryData || [])
      }

      setLoading(false)
    }

    loadDashboard()
  }, [agentRecord])

  const handleDelete = async (propertyId) => {
    const confirmed = window.confirm('Delete this property listing?')

    if (!confirmed) {
      return
    }

    const { error } = await supabase.from('properties').delete().eq('id', propertyId)

    if (error) {
      window.alert(error.message)
      return
    }

    setProperties((current) => current.filter((property) => property.id !== propertyId))
    setInquiries((current) => current.filter((inquiry) => inquiry.property_id !== propertyId))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 rounded-[34px] border border-[var(--color-line)] bg-[linear-gradient(135deg,_rgba(9,31,57,1),_rgba(35,58,93,0.92))] p-8 text-white shadow-[0_24px_80px_rgba(8,21,42,0.22)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker !text-[var(--color-gold-light)]">Agent Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold">Manage your portfolio and incoming interest.</h1>
          <p className="mt-4 max-w-2xl text-white/72">
            Welcome back{agentRecord?.name ? `, ${agentRecord.name}` : ''}. Keep listings sharp and respond to inquiries quickly.
          </p>
        </div>
        <Link to="/dashboard/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add New Listing
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-[var(--color-line)] bg-white p-6 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(204,162,79,0.14)] text-[var(--color-gold-deep)]">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-ink)]">Your Listings</h2>
              <p className="text-sm text-[var(--color-muted)]">{properties.length} active records loaded</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-[26px] bg-[var(--color-soft)]" />
              ))
            ) : properties.length ? (
              properties.map((property) => (
                <div
                  key={property.id}
                  className="flex flex-col gap-4 rounded-[26px] border border-[var(--color-line)] bg-[var(--color-soft)] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-ink)]">{property.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {property.city} • {property.status} • {property.type}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/dashboard/edit/${property.id}`} className="btn-secondary">
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </Link>
                    <button type="button" className="btn-danger" onClick={() => handleDelete(property.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[26px] border border-dashed border-[var(--color-line)] p-8 text-center text-[var(--color-muted)]">
                No listings yet. Add your first property to start receiving inquiries.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-[var(--color-line)] bg-white p-6 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(204,162,79,0.14)] text-[var(--color-gold-deep)]">
              <MailQuestion className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-ink)]">Recent Inquiries</h2>
              <p className="text-sm text-[var(--color-muted)]">Messages on your properties</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-[26px] bg-[var(--color-soft)]" />
              ))
            ) : inquiries.length ? (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-[26px] border border-[var(--color-line)] bg-[var(--color-soft)] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--color-ink)]">{inquiry.name}</h3>
                      <p className="text-sm text-[var(--color-muted)]">{inquiry.email}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy)]">
                      {inquiry.properties?.title || 'Property'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">{inquiry.message}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[26px] border border-dashed border-[var(--color-line)] p-8 text-center text-[var(--color-muted)]">
                No inquiries have arrived yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
