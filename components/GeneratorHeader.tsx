'use client'

import { Sparkles } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface GeneratorHeaderProps {
  title: string
  description: string
  labLabel?: string
  labColor?: string
  icon?: LucideIcon
  iconColor?: string
}

export function GeneratorHeader({
  title,
  description,
  labLabel = 'Image Lab',
  labColor = '#c3b5f0',
  icon: Icon = Sparkles,
  iconColor = 'text-primary',
}: GeneratorHeaderProps) {
  return (
    <header className="rounded-[28px] border border-white/10 bg-black/60 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon size={24} className={iconColor} />
        <p
          className="text-[10px] font-mono uppercase tracking-[0.6em]"
          style={{ color: labColor }}
        >
          {labLabel}
        </p>
      </div>
      <h1 className="text-4xl font-display font-bold text-white">{title}</h1>
      <p className="text-[12px] uppercase tracking-[0.3em] text-[#8f8397]">
        {description}
      </p>
    </header>
  )
}
