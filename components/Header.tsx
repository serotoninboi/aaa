'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { User, Zap, LogOut, Sparkles } from 'lucide-react'

const navLinks = [
  { label: 'STUDIO', href: '/studio' },
  { label: 'PRICING', href: '/pricing' },
]

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Claudine AI Home">
          <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-primary bg-primary/20 glow-cyan">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-pixel text-[8px] text-primary neon-cyan">CLAUDINE</p>
            <p className="font-pixel text-[10px] text-foreground">AI</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-primary neon-cyan'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Credits Display */}
              <div className="flex items-center gap-2 rounded border-2 border-primary bg-primary/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary glow-cyan">
                <Zap size={12} />
                <span>{user.credits ?? 0} CREDITS</span>
              </div>

              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right text-[9px] uppercase tracking-wider text-muted-foreground">
                  <p>LOGGED IN</p>
                  <p className="text-foreground font-bold">{user.name || user.email}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-primary bg-primary/20">
                  <User size={16} className="text-primary" />
                </div>
              </div>

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
                href="/login"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
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
