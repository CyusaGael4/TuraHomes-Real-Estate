import { Mail, MessageSquare, UserRound } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const initialState = {
  name: '',
  email: '',
  message: '',
}

export default function InquiryForm({ propertyId }) {
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback('')

    const payload = {
      property_id: propertyId,
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }

    const { error } = await supabase.from('inquiries').insert(payload)

    if (error) {
      setFeedback(error.message)
    } else {
      setForm(initialState)
      setFeedback('Your inquiry has been sent successfully.')
    }

    setSubmitting(false)
  }

  return (
    <div className="rounded-[28px] border border-[var(--color-line)] bg-white p-6 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
      <h3 className="text-2xl font-semibold text-[var(--color-ink)]">Ask about this property</h3>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Send a message and the agent will receive it directly in the dashboard.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="field-shell">
          <span className="field-label">Name</span>
          <div className="field-with-icon">
            <UserRound className="field-icon" />
            <input
              required
              type="text"
              className="field-input field-input-with-icon"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
        </label>
        <label className="field-shell">
          <span className="field-label">Email</span>
          <div className="field-with-icon">
            <Mail className="field-icon" />
            <input
              required
              type="email"
              className="field-input field-input-with-icon"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
        </label>
        <label className="field-shell">
          <span className="field-label">Message</span>
          <div className="field-with-icon items-start">
            <MessageSquare className="field-icon mt-3.5" />
            <textarea
              required
              rows="5"
              className="field-input field-input-with-icon resize-none"
              placeholder="I'm interested in this listing. Is it still available?"
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            />
          </div>
        </label>

        <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Inquiry'}
        </button>
        {feedback && <p className="text-sm text-[var(--color-muted)]">{feedback}</p>}
      </form>
    </div>
  )
}
