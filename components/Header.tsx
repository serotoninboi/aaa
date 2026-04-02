'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { User, Zap, LogOut, Sparkles, ChevronDown } from 'lucide-react'

const navLinks = [
  {
    label: 'STUDIO',
    href: '/studio',
    sublinks: [
      { label: 'Image Edit', href: '/studio/image-edit' },
      { label: 'Pose Changer', href: '/studio/pose-edit' },
            { label: 'Pose Changer', href: '/studio/pose' },
      { label: 'Face Swap', href: '/studio/face-swap' },
    ],
  },
  { label: 'PRICING', href: '/pricing' },
]

export function Header() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [credits, setCredits] = useState<number>(0)
  const [loadingCredits, setLoadingCredits] = useState(false)
  const [openSubnav, setOpenSubnav] = useState<string | null>(null)
  const pathname = usePathname()

  // Fetch user credits
  useEffect(() => {
    if (user) {
      setLoadingCredits(true)
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => setCredits(data.user?.credits ?? 0))
        .catch(err => console.error('Failed to fetch credits:', err))
        .finally(() => setLoadingCredits(false))
    }
  }, [user])

  const handleLogout = () => {
    signOut()
  }

  const isAuthenticated = isLoaded && !!user

  const isStudioActive = pathname.startsWith('/studio')

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="PixelForge Home">
          <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-primary bg-primary/20 glow-cyan">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-pixel text-[8px] text-primary neon-cyan">PIXELFORGE</p>
            <p className="font-pixel text-[10px] text-foreground">AI</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <div key={link.href} className="relative group">
              <button
                onClick={() =>
                  setOpenSubnav(openSubnav === link.label ? null : link.label)
                }
                className={`font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1 ${
                  isStudioActive && link.label === 'STUDIO'
                    ? 'text-primary neon-cyan'
                    : pathname === link.href
                    ? 'text-primary neon-cyan'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {link.sublinks && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      openSubnav === link.label ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Sub-navigation dropdown */}
              {link.sublinks && (
                <div
                  className={`absolute left-0 mt-2 w-40 rounded border-2 border-border bg-background/95 shadow-lg backdrop-blur transition-opacity duration-200 ${
                    openSubnav === link.label
                      ? 'opacity-100 visible'
                      : 'opacity-0 invisible'
                  }`}
                >
                  {link.sublinks.map(sublink => (
                    <Link
                      key={sublink.href}
                      href={sublink.href}
                      className={`block px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 border-border/50 last:border-b-0 transition-colors ${
                        pathname === sublink.href
                          ? 'text-primary neon-cyan bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                      }`}
                      onClick={() => setOpenSubnav(null)}
                    >
                      {sublink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Credits Display */}
              <div className="flex items-center gap-2 rounded border-2 border-primary bg-primary/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary glow-cyan">
                <Zap size={12} />
                <span>{loadingCredits ? '...' : credits} CREDITS</span>
              </div>

              {/* User Info */}
              <Link href="/studio/account" className="hidden sm:flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right text-[9px] uppercase tracking-wider text-muted-foreground">
                  <p>LOGGED IN</p>
                  <p className="text-foreground font-bold">{user.firstName || user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-primary bg-primary/20">
                  <User size={16} className="text-primary" />
                </div>
              </Link>

              {/* Account Button */}
              <Link
                href="/studio/account"
                className="rounded border-2 border-border px-3 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-all hover:border-primary hover:text-primary hover:glow-cyan inline-flex items-center gap-1"
              >
                <User size={14} />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="rounded border-2 border-border px-3 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-all hover:border-primary hover:text-primary hover:glow-cyan"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                LOGIN
              </Link>
              <Link
                href="/sign-up"
                className="rounded border-2 border-primary bg-primary/20 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-primary transition-all hover:glow-cyan glow-cyan"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
