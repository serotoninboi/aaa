'use client'

import { Sparkles } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface GeneratorHeaderProps {
  title: string
  description: string
  labLabel?: string
  icon?: LucideIcon
}

export function GeneratorHeader({
  title,
  description,
  labLabel = 'Private Studio',
  icon: Icon = Sparkles,
}: GeneratorHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-sensual relative overflow-hidden p-10 text-center noise-sensual"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[hsl(340,80%,65%)]/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[hsl(270,60%,55%)]/10 blur-3xl" />
      
      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[hsl(340,80%,65%)]/20 bg-[hsl(340,80%,65%)]/10">
            <Icon size={22} className="text-[hsl(340,80%,65%)]" />
          </div>
          <span className="section-label">{labLabel}</span>
        </div>
        
        <h1 className="mb-3 font-display text-4xl font-semibold text-white md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-lg font-sans text-base leading-relaxed text-white/50">
          {description}
        </p>
      </div>
    </motion.header>
  )
}
