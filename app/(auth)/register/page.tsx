'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Sparkles } from 'lucide-react'

function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/studio'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('All fields required')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(name, email, password)
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 border-2 border-secondary bg-card p-8 glow-magenta">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded border-2 border-secondary bg-secondary/20 glow-magenta mb-4">
          <Sparkles className="w-8 h-8 text-secondary" />
        </div>
        <p className="font-pixel text-xs text-secondary neon-magenta">CREATE ACCOUNT</p>
        <h1 className="font-pixel text-2xl text-foreground">JOIN CLAUDINE</h1>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Start creating amazing images</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="FULL NAME"
          placeholder="Jane Doe"
          value={name}
          onChange={e => setName(e.target.value)}
          autoComplete="name"
          className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground font-mono"
        />
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
          placeholder="Min 8 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border-2 border-border bg-background text-foreground placeholder:text-muted-foreground font-mono"
        />
        <Input
          id="confirm"
          label="CONFIRM PASSWORD"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
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
          className="arcade-btn w-full font-pixel text-xs bg-secondary/20 border-secondary hover:glow-magenta"
        >
          {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}
        </button>
      </form>
      
      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground font-mono">
        Already a member?{' '}
        <Link href="/login" className="text-secondary neon-magenta hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16 scanlines">
      <Suspense
        fallback={
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-secondary" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </main>
  )
}
