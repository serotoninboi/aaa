import { cn } from '@/lib/utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'success' | 'info'
}

function Alert({ className, variant = 'info', children, style, ...props }: AlertProps) {
  const variantStyles =
    variant === 'error'
      ? { borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)', color: 'rgba(239,68,68,0.8)' }
      : variant === 'success'
      ? { borderColor: 'rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.05)', color: 'rgba(134,239,172,0.9)' }
      : { borderColor: '#1e1e1e', background: '#111111', color: '#7a6f6d' }

  return (
    <div
      className={cn('border px-4 py-3 text-[11px] font-mono tracking-wide', className)}
      style={{ ...variantStyles, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export { Alert }

