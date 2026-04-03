'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  sparkleColor?: string
  logoText?: string
  tagline?: string
  taglineColor?: string
}

export function Logo({
  className = '',
  sparkleColor = 'hsl(340, 80%, 65%)',
  logoText = 'Claudine',
  tagline = 'Private Studio',
  taglineColor = 'text-white/40',
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label="Claudine AI Home">
      <motion.div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-500 hover:glow-rose`}
        style={{
          borderColor: `${sparkleColor}/30`,
          backgroundColor: `${sparkleColor}/10`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles size={18} color={sparkleColor} />
      </motion.div>
      <div>
        <p className="font-display text-lg font-semibold text-white">{logoText}</p>
        <p className={`font-sans text-[10px] uppercase tracking-[0.2em] ${taglineColor}`}>{tagline}</p>
      </div>
    </Link>
  );
}
