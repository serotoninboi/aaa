'use client'

import { useCallback } from 'react'
import { DropZone } from '@/components/DropZone'
import { Trash, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageInputProps {
  label: string
  preview: string | null
  file: File | null
  onFileChange: (file: File) => void
  onClear: () => void
}

export function ImageInput({ label, preview, file, onFileChange, onClear }: ImageInputProps) {
  return (
    <div className="glass-sensual overflow-hidden p-6 noise-sensual">
      <div className="mb-5 flex items-center justify-between">
        <span className="section-label">{label}</span>
        {file && (
          <span className="font-sans text-xs text-white/30">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DropZone onFile={onFileChange} />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            <div className="glass-sensual overflow-hidden p-4">
              <img
                src={preview}
                alt={label}
                className="h-64 w-full rounded-xl object-cover transition-all duration-500 group-hover:scale-[1.02]"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Remove button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                onClick={onClear}
                aria-label={`Remove ${label}`}
                className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.1] bg-black/60 text-white/70 opacity-0 backdrop-blur-xl transition-all duration-300 hover:border-[hsl(340,80%,65%)]/50 hover:text-[hsl(340,80%,65%)] group-hover:opacity-100"
              >
                <Trash size={18} />
              </motion.button>
              
              {/* Change button */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-500 group-hover:opacity-100">
                <div className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-black/60 px-5 py-2.5 font-sans text-sm text-white/70 backdrop-blur-xl">
                  <Upload size={14} />
                  <span>Change Image</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
