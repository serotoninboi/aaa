import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: '#8a8583' }}>
        {label}
      </label>
    )}
    <input
      ref={ref}
      id={id}
      className={cn(
        'h-9 w-full border px-3 text-xs font-mono transition-all duration-200 focus:outline-none',
        className
      )}
      style={{
        background: '#111111',
        borderColor: error ? 'rgba(239,68,68,0.4)' : '#1e1e1e',
        color: '#f0eae8',
      }}
      onFocus={e => {
        if (!error) e.target.style.borderColor = '#ff2d78'
        e.target.style.boxShadow = '0 0 0 1px rgba(255,45,120,0.15)'
      }}
      onBlur={e => {
        if (!error) e.target.style.borderColor = '#1e1e1e'
        e.target.style.boxShadow = 'none'
      }}
      {...props}
    />
    {error && <p className="text-[10px] font-mono" style={{ color: 'rgba(239,68,68,0.7)' }}>{error}</p>}
  </div>
))
Input.displayName = 'Input'

export { Input }

