'use client'

import { useCallback } from 'react'
import { DropZone } from '@/components/DropZone'
import { Trash } from 'lucide-react'

interface ImageInputProps {
  label: string
  preview: string | null
  file: File | null
  onFileChange: (file: File) => void
  onClear: () => void
}

export function ImageInput({ label, preview, file, onFileChange, onClear }: ImageInputProps) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
      <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#a08fb7] mb-4">
        {label}
      </p>
      {!preview ? (
        <DropZone onFile={onFileChange} />
      ) : (
        <div className="relative group">
          <img
            src={preview}
            alt={label}
            className="h-64 w-full rounded-lg border-2 border-white/10 object-cover transition-opacity duration-200"
          />
          <button
            onClick={onClear}
            aria-label={`Remove ${label}`}
            className="absolute right-3 top-3 rounded-full bg-red-600/90 p-2 text-white opacity-0 transition-all duration-150 hover:bg-red-700 focus:opacity-100 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Trash size={18} />
          </button>
          <div className="absolute inset-0 rounded-lg bg-black/0 transition-colors duration-200 group-hover:bg-black/5" />
        </div>
      )}
    </div>
  )
}
