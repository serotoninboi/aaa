import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, id, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: '#3d3636' }}>
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      id={id}
      className={cn('w-full border px-3 py-2.5 text-xs font-mono resize-none transition-all duration-200 focus:outline-none', className)}
      style={{ background: '#111111', borderColor: '#1e1e1e', color: '#f0eae8' }}
      onFocus={e => {
        e.target.style.borderColor = '#ff2d78'
        e.target.style.boxShadow = '0 0 0 1px rgba(255,45,120,0.15)'
      }}
      onBlur={e => {
        e.target.style.borderColor = '#1e1e1e'
        e.target.style.boxShadow = 'none'
      }}
      {...props}
    />
  </div>
))
Textarea.displayName = 'Textarea'

export { Textarea }

