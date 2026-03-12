'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Sparkles } from 'lucide-react'

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/studio'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('All fields required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 border-2 border-primary bg-card p-8 glow-cyan">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded border-2 border-primary bg-primary/20 glow-cyan mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <p className="font-pixel text-xs text-primary neon-cyan">WELCOME BACK</p>
        <h1 className="font-pixel text-2xl text-foreground">SIGN IN</h1>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Continue your creative journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="EMAIL"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground font-mono"
        />
        <Input
          id="password"
          label="PASSWORD"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground font-mono"
        />
        {error && (
          <Alert variant="error" className="text-xs uppercase tracking-wider font-mono">
            {error}
          </Alert>
        )}
        <button
          type="submit"
          disabled={loading}
          className="arcade-btn w-full font-pixel text-xs"
        >
          {loading ? 'SIGNING IN…' : 'SIGN IN'}
        </button>
      </form>
      
      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground font-mono">
        No account?{' '}
        <Link href="/register" className="text-primary neon-cyan hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16 scanlines">
      <Suspense
        fallback={
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
