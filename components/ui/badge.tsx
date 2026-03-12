import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'dim'
}

function Badge({ className, variant = 'default', style, ...props }: BadgeProps) {
  const variantStyles =
    variant === 'accent'
      ? { borderColor: 'rgba(255,45,120,0.3)', color: '#ff2d78', background: 'rgba(255,45,120,0.06)' }
      : variant === 'dim'
      ? { color: '#3d3636', border: 'none', background: 'transparent' }
      : { borderColor: '#1e1e1e', color: '#7a6f6d', background: '#111111' }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-mono tracking-[0.15em] uppercase',
        className
      )}
      style={{ ...variantStyles, ...style }}
      {...props}
    />
  )
}

export { Badge }

