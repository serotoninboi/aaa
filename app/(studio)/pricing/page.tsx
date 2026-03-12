'use client'
import { useState } from 'react'
import { Check, Zap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: '9.99',
    credits: 50,
    features: ['50 bespoke edits', 'Standard support', 'No watermark', '7-day vault'],
    color: 'rgba(255, 45, 120, 0.45)',
  },
  {
    name: 'Pro',
    price: '24.99',
    credits: 200,
    features: ['200 cinematic edits', 'Priority feedback', 'No watermark', '30-day vault', 'Early model access'],
    color: 'rgba(255, 45, 120, 0.8)',
    popular: true,
  },
  {
    name: 'Unlimited',
    price: '49.99',
    credits: 500,
    features: ['500 studio-grade edits', '24/7 concierge', 'No watermark', 'Permanent vault', 'Commercial release'],
    color: 'rgba(165, 91, 255, 0.75)',
  },
]

const FAQS = [
  {
    q: 'How do credits work?',
    a: 'One credit equals one final render. Credits do not expire while your account remains active.',
  },
  {
    q: 'Is every edit private?',
    a: 'Yes—everything is encrypted, kept off-chain, and yours alone unless you share a link.',
  },
  {
    q: 'What forms of payment?',
    a: 'Visa/Mastercard/Amex plus BTC, ETH, USDT for occult clients.',
  },
  {
    q: 'Refund policy?',
    a: 'Credits are final upon delivery. Test the Starter pack if you need time to feel the flow.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handlePurchase = (planName: string) => {
    setLoadingPlan(planName)
    setTimeout(() => setLoadingPlan(null), 1500)
  }

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.12),_transparent_65%),_radial-gradient(circle_at_0%_80%,_rgba(165,91,255,0.2),_transparent_55%)] py-16">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(120deg, rgba(10, 0, 20, 0.9), rgba(0, 0, 0, 0))' }} />
      <main className="relative z-10 mx-auto max-w-6xl space-y-14 px-4">
        <section className="neon-panel relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,45,120,0.15),_transparent_70%)]" />
          <div className="relative z-10 space-y-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#f6d1fa]">Pricing Grid</p>
            <h1 className="font-oxanium text-4xl uppercase tracking-[0.2em] text-white">Fuel credits by desire</h1>
            <p className="mx-auto max-w-2xl readable-copy text-[12px] tracking-[0.3em] text-[#dcd5ff]">
              Every plan unlocks the same seductive engine, but the cadence of your credits and concierge touch changes. Slide into the band that matches your workflow.
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.35em] text-white">
              <Zap size={18} className="text-[#ff6da0]" />
              Credits replenish instantly with zero subscriptions
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {PLANS.map(plan => (
            <article
              key={plan.name}
              className={`relative overflow-hidden rounded-[34px] border border-white/10 bg-black/60 p-6 shadow-[0_35px_80px_rgba(0,0,0,0.85)] ${plan.popular ? 'border-[#ff6da0]' : ''}`}
            >
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${plan.color}, transparent 65%)`, opacity: 0.4 }} />
              <div className="relative z-10 space-y-4">
                {plan.popular && (
                  <div className="rounded-full border border-white/20 bg-gradient-to-r from-[#ff2d78] to-[#a55bff] px-4 py-1 text-[10px] font-mono uppercase tracking-[0.4em] text-white">
                    Most beloved
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.6em] text-[#b2a5d8]">{plan.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-oxanium text-white">€{plan.price}</span>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#8c869c]">per pack</span>
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.4em]" style={{ color: plan.color }}>
                    {plan.credits} credits
                  </p>
                </div>
                <ul className="space-y-2 text-[11px] text-[#dcd5ff]">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check size={16} className="text-[#ff6da0]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePurchase(plan.name)}
                  disabled={!!loadingPlan}
                  className="neon-button w-full rounded-2xl px-5 py-3 text-[11px]"
                >
                  {loadingPlan === plan.name ? 'Processing…' : 'Secure purchase'}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,_rgba(255,45,120,0.08),_rgba(10,0,10,0.9))] p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-oxanium uppercase tracking-[0.2em] text-white">Trust the atelier</h2>
            <p className="readable-copy text-[12px] tracking-[0.35em] text-[#cfc9e7]">
              VIP concierge, encrypted workflows, and surgical credit precision keep you in the creative sweet spot.
            </p>
            <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.4em] text-[#f6e4ff]">
              <Sparkles size={20} className="text-[#ff6da0]" />
              24/7 concierge channel inside your user account
            </div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#f6e4ff]">
              <Zap size={20} className="text-[#a55bff]" />
              Credits top-up instantly—no waiting for batch queues
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#b7accd]">Need bespoke onboarding?</p>
            <p className="readable-copy text-[12px] text-[#fdfbff]">
              Reply with a creative brief and our strategist will craft a custom project plan, timeline, and credit audit in under 24 hours.
            </p>
            <button className="neon-button w-full rounded-2xl px-5 py-3 text-[11px]">Request bespoke plan</button>
          </div>
        </section>

        <section className="space-y-6 rounded-[36px] border border-white/10 bg-black/60 p-6">
          <h3 className="text-3xl font-oxanium uppercase tracking-[0.3em] text-white">If you still wonder…</h3>
          <div className="grid gap-4">
            {FAQS.map((faq, index) => (
              <article
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,_rgba(255,45,120,0.05),_rgba(10,0,10,0.9))]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-[12px] font-semibold tracking-[0.3em] text-white"
                >
                  {faq.q}
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4 readable-copy text-[#b7accd]">
                    {faq.a}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
