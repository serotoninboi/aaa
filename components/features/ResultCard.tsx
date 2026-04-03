'use client'

interface ResultCardProps {
  result: string | null
  seed?: number
  accentColor?: string
  label?: string
}

export function ResultCard({
  result,
  seed,
  accentColor = '#ff2d78',
  label = 'Result',
}: ResultCardProps) {
  if (!result) return null

  const formattedLabel = `${label} Output`
  
  return (
    <div
      className="rounded-[32px] border border-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)] transition-all duration-300"
      style={{
        background: `linear-gradient(150deg, rgba(${hexToRgb(accentColor)},0.05), rgba(5,0,10,0.85))`,
      }}
      role="region"
      aria-label={formattedLabel}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#a08fb7] mb-3">
        {label}
      </p>
      <div className="relative group">
        <img
          src={result}
          alt={formattedLabel}
          className="w-full rounded-lg border border-white/10 transition-opacity duration-200 group-hover:opacity-95"
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-t from-black/0 to-transparent" />
      </div>
      {seed !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[8px] text-[#7a6f6d] font-mono tracking-wide">
            Seed: <span className="text-white/60 font-bold">{seed}</span>
          </p>
        </div>
      )}
    </div>
  )
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255,45,120'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
