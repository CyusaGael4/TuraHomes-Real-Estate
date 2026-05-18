import { LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'user',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const { error } = await signUp(form)

    if (error) {
      setErrorMessage(error.message)
      setSubmitting(false)
      return
    }

    setSuccessMessage('Account created. Check your email if confirmation is enabled, then log in.')
    setSubmitting(false)
    setTimeout(() => navigate('/login'), 1000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[34px] border border-[var(--color-line)] bg-white p-8 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
          <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Create your TuraHomes account</h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Sign up as a buyer or renter, or choose agent to unlock listing management.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
              <span className="field-label">Password</span>
              <div className="field-with-icon">
                <LockKeyhole className="field-icon" />
                <input
                  required
                  type="password"
                  className="field-input field-input-with-icon"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
            </label>
            <label className="field-shell">
              <span className="field-label">Role</span>
              <select
                className="field-input"
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              >
                <option value="user">I am a buyer/renter</option>
                <option value="agent">I am an agent</option>
              </select>
            </label>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

            <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--color-muted)]">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[var(--color-navy)]">
              Login here
            </Link>
            .
          </p>
        </div>

        <div className="rounded-[34px] border border-[var(--color-line)] bg-[linear-gradient(180deg,_rgba(204,162,79,0.14),_rgba(255,255,255,1))] p-8 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
          <p className="section-kicker">Built For Movement</p>
          <h2 className="mt-3 text-4xl font-semibold text-[var(--color-ink)]">One account, tailored for every kind of property journey.</h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-[var(--color-ink)]">Buyers and renters</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Browse listings, compare neighborhoods, and send inquiries in a polished experience.
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--color-navy)] p-5 text-white shadow-sm">
              <h3 className="font-semibold">Agents</h3>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Manage properties, upload gallery images, and track new buyer interest from a focused dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
