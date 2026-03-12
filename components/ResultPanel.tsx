'use client'

import { Download, ImageIcon } from 'lucide-react'
import { Button } from './ui/button'

interface ResultPanelProps {
  result?: string | null
  loading?: boolean
  label?: string
}

export function ResultPanel({ result, loading, label = 'Output' }: ResultPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/70 p-0.5">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#ff2d78] via-[#ff6da0] to-[#a55bff] opacity-40 blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col gap-4 rounded-[26px] bg-black/80 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#b7accd]">
            {label}
          </span>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#8d82a9]">
            <span className="h-2 w-2 rounded-full bg-[#ff6da0]" />
            real-time output
          </div>
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.2),_transparent_65%)] p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center text-[12px] font-mono uppercase tracking-[0.4em] text-white">
              <div className="relative h-12 w-12 animate-pulse">
                <span className="absolute inset-0 rounded-full border border-[#ff2d78]/30" />
                <span className="absolute inset-0 rounded-full border border-t-[#ff2d78] border-r-transparent animate-spin" />
              </div>
              Processing preview...
            </div>
          ) : result ? (
            <img src={result} alt="Result" className="h-full w-full rounded-xl object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-center text-[11px] font-mono uppercase tracking-[0.4em] text-[#7a6f6d]">
              <ImageIcon size={28} />
              <span>Result appears here</span>
              <p className="text-[8px] tracking-[0.6em]">Stay tuned for the next frame</p>
            </div>
          )}
        </div>

        {result && (
          <a href={result} download="pixelforge-result.png" className="self-end">
            <Button className="neon-button text-[10px] uppercase tracking-[0.4em]" variant="primary" size="sm">
              <Download size={12} />
              Download image
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}
