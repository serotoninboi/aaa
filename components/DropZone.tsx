'use client'

import { useCallback, useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  onFile: (file: File) => void
  preview?: string | null
  onClear?: () => void
}

export function DropZone({ onFile, preview, onClear }: DropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      onFile(file)
    },
    [onFile]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0210] via-[#050006] to-[#050004] shadow-[0_0_40px_rgba(5,0,20,0.9)]">
      <div
        className={cn(
          'absolute inset-0 transition duration-500',
          dragging ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'radial-gradient(circle, rgba(255,45,120,0.45), transparent 55%)',
        }}
      />
      <div
        className="relative min-h-[220px] rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center text-[11px] font-mono uppercase tracking-[0.3em] text-muted-foreground transition-all duration-200"
        onDragOver={e => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !preview && inputRef.current?.click()}
        style={{
          cursor: 'pointer',
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/60 text-white">
          <Upload size={20} className="text-[#ff6da0]" />
        </div>
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="relative z-10 max-h-48 w-full rounded-2xl object-contain"
          />
        ) : (
          <div className="relative flex flex-col items-center gap-1 text-[10px] text-[#b0a5c6]">
            <span>Drop image here</span>
            <span className="text-[8px] tracking-[0.4em] text-[#797088]">PNG · JPG · WEBP</span>
          </div>
        )}
        <span className="hidden text-[9px] uppercase tracking-[0.4em] text-[#7a6f6d] lg:block">Click to browse</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) handleFile(file)
        }}
      />
      {preview && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:border-[#ff2d78] hover:text-[#ff2d78]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
