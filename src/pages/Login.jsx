import { LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    const { error } = await signIn(form)

    if (error) {
      setErrorMessage(error.message)
      setSubmitting(false)
      return
    }

    navigate(location.state?.from?.pathname || '/')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[34px] border border-[var(--color-line)] bg-[linear-gradient(135deg,_rgba(9,31,57,1),_rgba(35,58,93,0.92))] p-8 text-white shadow-[0_24px_80px_rgba(8,21,42,0.22)]">
          <p className="section-kicker !text-[var(--color-gold-light)]">Welcome Back</p>
          <h1 className="mt-3 text-4xl font-semibold">Access saved searches and your property workspace.</h1>
          <p className="mt-5 max-w-lg text-white/72">
            Log in to manage listings, review inquiries, and continue where you left off with TuraHomes.
          </p>
          <img
            src="/brand/turahomes-logo.png"
            alt="TuraHomes logo"
            className="mt-10 h-28 w-auto rounded-xl bg-white/8 p-3"
          />
        </div>

        <div className="rounded-[34px] border border-[var(--color-line)] bg-white p-8 shadow-[0_18px_55px_rgba(8,21,42,0.08)]">
          <h2 className="text-3xl font-semibold text-[var(--color-ink)]">Login</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">Use your email and password to continue.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--color-muted)]">
            Need an account?{' '}
            <Link to="/signup" className="font-semibold text-[var(--color-navy)]">
              Create one here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
