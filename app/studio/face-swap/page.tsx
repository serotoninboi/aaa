'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ImageInput } from '@/components/ImageInput'
import { GeneratorHeader } from '@/components/GeneratorHeader'
import { Users, Sparkles, Download } from 'lucide-react'
import { motion } from 'framer-motion'

const SWAP_MODELS = [
  { value: 'inswapper_128.onnx', label: 'InSwapper 128 (Fast)' },
  { value: 'hyperswap_1a_256.onnx', label: 'HyperSwap 1A' },
  { value: 'hyperswap_1b_256.onnx', label: 'HyperSwap 1B (Quality)' },
  { value: 'hyperswap_1c_256.onnx', label: 'HyperSwap 1C' },
]

const FACE_RESTORE_MODELS = [
  { value: 'none', label: 'None' },
  { value: 'GPEN-BFR-512.onnx', label: 'GPEN-BFR-512' },
]

export default function FaceSwapPage() {
  const { getToken } = useAuth()
  const [sourceImage, setSourceImage] = useState<File | null>(null)
  const [sourcePreview, setSourcePreview] = useState<string | null>(null)
  const [targetImage, setTargetImage] = useState<File | null>(null)
  const [targetPreview, setTargetPreview] = useState<string | null>(null)
  const [targetIndex, setTargetIndex] = useState(0)
  const [swapModel, setSwapModel] = useState('hyperswap_1b_256.onnx')
  const [faceRestoreModel, setFaceRestoreModel] = useState('none')
  const [restoreStrength, setRestoreStrength] = useState(0.7)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSourceImage = useCallback((f: File) => {
    setSourceImage(f)
    setResult(null)
    setError('')
    const r = new FileReader()
    r.onload = () => setSourcePreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const handleTargetImage = useCallback((f: File) => {
    setTargetImage(f)
    setResult(null)
    setError('')
    const r = new FileReader()
    r.onload = () => setTargetPreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const clear = useCallback(() => {
    setSourceImage(null)
    setSourcePreview(null)
    setTargetImage(null)
    setTargetPreview(null)
    setResult(null)
  }, [])

  const handleSubmit = async () => {
    if (!sourceImage || !targetImage) {
      setError('Upload both source and target images')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('sourceImage', sourceImage)
      formData.append('targetImage', targetImage)
      formData.append('targetIndex', targetIndex.toString())
      formData.append('swapModel', swapModel)
      formData.append('faceRestoreModel', faceRestoreModel)
      formData.append('restoreStrength', restoreStrength.toString())

      const response = await fetch('/api/face-swap', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Face swap failed')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen py-12 px-4">
      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        <GeneratorHeader
          title="Face Swap"
          description="Transform faces with AI-powered precision. Upload a source face and target image to create stunning results."
          icon={Users}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left Panel - Image Inputs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <ImageInput
              label="Source Face"
              preview={sourcePreview}
              file={sourceImage}
              onFileChange={handleSourceImage}
              onClear={() => {
                setSourceImage(null)
                setSourcePreview(null)
              }}
            />

            <ImageInput
              label="Target Image"
              preview={targetPreview}
              file={targetImage}
              onFileChange={handleTargetImage}
              onClear={() => {
                setTargetImage(null)
                setTargetPreview(null)
              }}
            />

            {error && (
              <div className="glass-sensual border-l-4 border-l-red-500/50 p-5">
                <p className="font-sans text-sm text-red-300">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!sourceImage || !targetImage || loading}
                className="btn-sensual flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Generate</span>
                    </>
                  )}
                </span>
              </button>
              
              <button
                onClick={clear}
                className="btn-subtle"
              >
                Clear
              </button>
            </div>
          </motion.div>

          {/* Right Panel - Settings & Result */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Settings Panel */}
            <div className="glass-sensual p-8 noise-sensual">
              <p className="section-label mb-6">Configuration</p>

              <div className="space-y-6">
                {/* Swap Model */}
                <div className="space-y-3">
                  <label className="block font-sans text-sm text-white/70">
                    Swap Model
                  </label>
                  <select
                    value={swapModel}
                    onChange={(e) => setSwapModel(e.target.value)}
                    className="select-sensual"
                  >
                    {SWAP_MODELS.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Face Restore */}
                <div className="space-y-3">
                  <label className="block font-sans text-sm text-white/70">
                    Face Restore
                  </label>
                  <select
                    value={faceRestoreModel}
                    onChange={(e) => setFaceRestoreModel(e.target.value)}
                    className="select-sensual"
                  >
                    {FACE_RESTORE_MODELS.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Face Index */}
                <div className="space-y-3">
                  <label className="block font-sans text-sm text-white/70">
                    Target Face Index: {targetIndex}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={targetIndex}
                    onChange={(e) => setTargetIndex(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10"
                    style={{ accentColor: 'hsl(340, 80%, 65%)' }}
                  />
                  <div className="flex justify-between text-xs text-white/30">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                  </div>
                </div>

                {/* Restore Strength */}
                {faceRestoreModel !== 'none' && (
                  <div className="space-y-3">
                    <label className="block font-sans text-sm text-white/70">
                      Restore Strength: {Math.round(restoreStrength * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={restoreStrength}
                      onChange={(e) => setRestoreStrength(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10"
                      style={{ accentColor: 'hsl(340, 80%, 65%)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Result Panel */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-sensual overflow-hidden noise-sensual"
              >
                <div className="p-6 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="section-label">Result</span>
                    <a
                      href={result}
                      download
                      className="flex items-center gap-2 text-sm font-medium text-[hsl(340,80%,65%)] hover:text-[hsl(340,80%,75%)] transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <img
                    src={result}
                    alt="Result"
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
