'use client'

import { useCallback, useState, useRef } from 'react'
import { Upload, X, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative glass-sensual overflow-hidden"
    >
      {/* Ambient glow on drag */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          dragging ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'radial-gradient(circle at center, hsl(340 80% 65% / 0.15), transparent 70%)',
        }}
      />
      
      <div
        className="relative min-h-[280px] p-8 flex flex-col items-center justify-center gap-5 text-center transition-all duration-300"
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !preview && inputRef.current?.click()}
        style={{ cursor: preview ? 'default' : 'pointer' }}
      >
        {!preview ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-500 group-hover:border-[hsl(340,80%,65%)]/30 group-hover:bg-[hsl(340,80%,65%)]/5">
              <ImagePlus size={28} className="text-[hsl(340,80%,65%)]" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="font-sans text-base font-medium text-white/80">
                Drop image here
              </span>
              <span className="font-sans text-sm text-white/40">
                or click to browse
              </span>
              <span className="mt-2 font-sans text-xs text-white/25">
                Supports PNG, JPG, WEBP
              </span>
            </div>
          </>
        ) : (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Preview"
              className="relative z-10 max-h-56 w-full rounded-xl object-contain shadow-2xl"
            />
            {onClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                className="absolute -right-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-black/60 text-white/70 backdrop-blur-xl transition-all duration-300 hover:border-[hsl(340,80%,65%)]/50 hover:text-[hsl(340,80%,65%)] hover:scale-110"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) handleFile(file)
        }}
      />
    </motion.div>
  )
}
