import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-mono text-xs tracking-widest uppercase transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 select-none',
  {
    variants: {
      variant: {
        primary: 'border text-white',
        ghost: 'text-[#7a6f6d] hover:text-[#f0eae8]',
        outline: 'border text-[#f0eae8]',
        danger: 'border text-red-400',
      },
      size: {
        sm: 'h-7 px-3 text-[10px]',
        md: 'h-9 px-4 text-xs',
        lg: 'h-11 px-6 text-xs',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, children, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    const variantStyles: React.CSSProperties =
      variant === 'primary' || !variant
        ? { borderColor: '#ff2d78', background: 'rgba(255,45,120,0.08)', color: '#ff2d78' }
        : variant === 'outline'
        ? { borderColor: '#2a2a2a', background: '#111111', color: '#f0eae8' }
        : variant === 'danger'
        ? { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }
        : {}

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...variantStyles, ...style }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {children}
          </span>
        ) : children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

