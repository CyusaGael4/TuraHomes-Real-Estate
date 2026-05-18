import { Mail, Phone, UserRound } from 'lucide-react'

export default function AgentCard({ agent }) {
  if (!agent) {
    return null
  }

  return (
    <div className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-navy)] p-6 text-white shadow-[0_22px_60px_rgba(8,21,42,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
        Listed By
      </p>
      <h3 className="mt-3 text-2xl font-semibold">{agent.name}</h3>

      <div className="mt-5 space-y-3 text-sm text-white/80">
        <p className="flex items-center gap-3">
          <UserRound className="h-4 w-4 text-[var(--color-gold-light)]" />
          Trusted TuraHomes Agent
        </p>
        <p className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-[var(--color-gold-light)]" />
          {agent.email}
        </p>
        <p className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-[var(--color-gold-light)]" />
          {agent.phone || 'Phone number not provided'}
        </p>
      </div>
    </div>
  )
}
