'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { User, Zap, LogOut, Sparkles, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  {
    label: 'Studio',
    href: '/studio',
    sublinks: [
      { label: 'Image Edit', href: '/studio/image-edit' },
      { label: 'Pose Changer', href: '/studio/pose-edit' },
      { label: 'Face Swap', href: '/studio/face-swap' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
]

export function Header() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [credits, setCredits] = useState<number>(0)
  const [loadingCredits, setLoadingCredits] = useState(false)
  const [openSubnav, setOpenSubnav] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (user) {
      setLoadingCredits(true)
      fetch('/api/user/me')
        .then((res) => res.json())
        .then((data) => setCredits(data.user?.credits ?? 0))
        .catch((err) => console.error('Failed to fetch credits:', err))
        .finally(() => setLoadingCredits(false))
    }
  }, [user])

  const handleLogout = () => {
    signOut()
  }

  const isAuthenticated = isLoaded && !!user
  const isStudioActive = pathname.startsWith('/studio')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/20 backdrop-blur-2xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Claudine AI Home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[hsl(340,80%,65%)]/30 bg-[hsl(340,80%,65%)]/10 transition-all duration-500 hover:glow-rose">
            <Sparkles size={18} className="text-[hsl(340,80%,65%)]" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white">Claudine</p>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">Private Studio</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <div key={link.href} className="relative group">
              <button
                onClick={() =>
                  setOpenSubnav(openSubnav === link.label ? null : link.label)
                }
                className={`flex items-center gap-1 font-sans text-sm font-medium tracking-wide transition-colors ${
                  isStudioActive && link.label === 'Studio'
                    ? 'text-[hsl(340,80%,65%)]'
                    : pathname === link.href
                    ? 'text-[hsl(340,80%,65%)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
                {link.sublinks && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      openSubnav === link.label ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Sub-navigation dropdown */}
              <AnimatePresence>
                {link.sublinks && openSubnav === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-3 w-48 overflow-hidden glass-sensual"
                  >
                    {link.sublinks.map((sublink) => (
                      <Link
                        key={sublink.href}
                        href={sublink.href}
                        className={`block px-5 py-3.5 font-sans text-sm transition-colors ${
                          pathname === sublink.href
                            ? 'bg-[hsl(340,80%,65%)]/10 text-[hsl(340,80%,65%)]'
                            : 'text-white/60 hover:bg-white/[0.03] hover:text-white'
                        }`}
                        onClick={() => setOpenSubnav(null)}
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* Credits Display */}
              <div className="flex items-center gap-2 rounded-xl border border-[hsl(40,60%,75%)]/20 bg-[hsl(40,60%,75%)]/5 px-4 py-2">
                <Zap size={14} className="text-[hsl(40,60%,75%)]" />
                <span className="font-sans text-sm font-medium text-[hsl(40,60%,75%)]">
                  {loadingCredits ? '...' : credits}
                </span>
              </div>

              {/* Account Button */}
              <Link
                href="/account"
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.06]"
              >
                <div className="text-right">
                  <p className="font-sans text-xs text-white/40">
                    {user.firstName || 'User'}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                  <User size={16} className="text-white/60" />
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/[0.06] p-2.5 text-white/40 transition-all duration-300 hover:border-red-500/30 hover:text-red-400"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="font-sans text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-[hsl(340,80%,65%)]/30 bg-[hsl(340,80%,65%)]/10 px-5 py-2.5 font-sans text-sm font-medium text-[hsl(340,80%,65%)] transition-all duration-300 hover:glow-rose"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
