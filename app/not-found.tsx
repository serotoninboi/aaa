import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <h1 className="text-6xl font-display font-bold text-primary">404</h1>
      <p className="text-lg text-muted-foreground">Page not found</p>
      <Link 
        href="/" 
        className="cyber-button"
      >
        Go Home
      </Link>
    </div>
  )
}
