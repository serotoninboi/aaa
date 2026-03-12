'use client'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Sparkles, CreditCard, ShieldCheck, Zap } from 'lucide-react'

const ACTIVITY = [
  { tag: 'Studio', detail: 'Completed 3 pose edits', time: '2h ago' },
  { tag: 'Billing', detail: 'Added 200 credits (Pro pack)', time: 'Yesterday' },
  { tag: 'Support', detail: 'Requested bespoke lighting setup', time: '3 days ago' },
]

export default function AccountPage() {
  const { user, logout, token } = useAuth()

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.12),_transparent_65%),_radial-gradient(circle_at_0%_80%,_rgba(165,91,255,0.2),_transparent_55%)] py-16">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(90deg, rgba(10,0,20,0.95), rgba(0,0,0,0))' }} />
      <main className="relative z-10 mx-auto max-w-5xl space-y-12 px-4">
        <section className="neon-panel relative overflow-hidden rounded-[36px] border border-white/10 bg-black/60 p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,45,120,0.2),_transparent_70%)]" />
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#d4c7f5]">Account</p>
            <h1 className="font-oxanium text-4xl uppercase tracking-[0.2em] text-white">Private control room</h1>
            <p className="readable-copy text-[12px] tracking-[0.35em] text-[#cfc9e7]">
              Manage credentials, credits, and collaborations from one illuminated dashboard.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-[#f6e4ff]">
              <ShieldCheck size={18} className="text-[#ff6da0]" />
              JWT tokens rotate every 12h
              <Zap size={18} className="text-[#a55bff]" />
              Live sync with studio sessions
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-[34px] border border-white/10 bg-black/60 p-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="section-lead">Profile</p>
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,45,120,0.12),_rgba(10,0,10,0.95))] p-5">
              <p className="text-[12px] uppercase tracking-[0.4em] text-[#b7accd]">Name</p>
              <p className="text-2xl font-oxanium text-white">{user?.name || 'Luminous Creator'}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.4em] text-[#a8a0c4]">{user?.email || 'you@example.com'}</p>
            </div>
            <p className="section-lead">Stream token</p>
            <div className="rounded-[28px] border border-dashed border-white/20 bg-black/60 px-5 py-4 text-[10px] uppercase tracking-[0.4em] text-[#8c879c]">
              {token ? `${token.slice(0, 20)}…` : 'No session yet'}
            </div>
            <button
              onClick={logout}
              className="neon-button w-full rounded-2xl px-5 py-3 text-[11px]"
            >
              Sign out securely
            </button>
          </div>
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,45,120,0.15),_rgba(5,0,10,0.9))] p-6">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.6em] text-[#f6d1fa]">
                <CreditCard size={18} /> Credits
              </div>
              <p className="mt-2 text-5xl font-oxanium text-white">322</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#b7accd]">Active balance</p>
              <div className="mt-4 grid gap-3 text-[11px] text-[#dcd5ff]">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#ff6da0]" />
                  42 generated assets this week
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#a55bff]" />
                  Next auto-refill: +200 credits
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-black/50 p-5 text-[11px] uppercase tracking-[0.4em] text-[#b7accd]">
            <p className="readable-copy">
                Support status: <span className="text-[#ff6da0]">VIP enabled</span>
              </p>
              <p className="readable-copy text-[10px] text-[#8c879c]">Private concierge responds within 2h.</p>
              <Link
                href="/pricing"
                className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white"
              >
                Upgrade plan
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 text-[11px] uppercase tracking-[0.4em] text-[#dcd5ff] lg:grid-cols-3">
          {ACTIVITY.map(item => (
            <article key={item.detail} className="rounded-[26px] border border-white/5 bg-black/40 p-4">
              <p className="text-[9px] tracking-[0.6em] text-[#b7accd]">{item.tag}</p>
              <p className="mt-2 text-sm text-white">{item.detail}</p>
              <p className="mt-3 text-[9px] text-[#7f7a90]">{item.time}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
