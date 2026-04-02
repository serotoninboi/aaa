'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ImageInput } from '@/components/ImageInput'
import { GeneratorHeader } from '@/components/GeneratorHeader'
import { ResultCard } from '@/components/ResultCard'
import { Slider } from '@/components/ui/slider'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'

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

const TARGET_INDICES = [0, 1, 2, 3, 4]

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
    <div className="relative overflow-hidden py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-4">
        <GeneratorHeader
          title="Face Swap"
          description="Swap faces with AI-powered precision"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <ImageInput
              label="Source (Face)"
              preview={sourcePreview}
              file={sourceImage}
              onFileChange={handleSourceImage}
              onClear={() => {
                setSourceImage(null)
                setSourcePreview(null)
              }}
            />

            <ImageInput
              label="Target (Body)"
              preview={targetPreview}
              file={targetImage}
              onFileChange={handleTargetImage}
              onClear={() => {
                setTargetImage(null)
                setTargetPreview(null)
              }}
            />

            {error && (
              <Alert variant="destructive" className="text-xs uppercase tracking-[0.3em]">
                {error}
              </Alert>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!sourceImage || !targetImage || loading}
                aria-busy={loading}
                className="flex-1 rounded-2xl py-3 px-4 bg-gradient-to-r from-[#ff2d78] to-[#a55bff] text-white font-mono text-[11px] font-bold uppercase tracking-[0.4em] min-h-12 transition-all duration-150 hover:shadow-[0_0_25px_rgba(255,45,120,0.6)] focus:outline-none focus:ring-2 focus:ring-[#ff2d78] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none"
              >
                {loading ? 'Processing...' : 'Swap'}
              </button>
              <button
                onClick={clear}
                className="rounded-2xl py-3 px-4 border-2 border-white/10 text-[#a08fb7] font-mono text-[11px] font-bold uppercase tracking-[0.4em] min-h-12 transition-all duration-150 hover:border-[#ff2d78] hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Panel - Settings & Result */}
          <div className="space-y-6">
<div className="rounded-[32px] border border-white/10 bg-black/60 p-6 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] focus-within:border-white/20 transition-colors duration-200">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
              Settings
            </p>

            {/* Swap Model */}
            <div className="space-y-2">
              <Label htmlFor="swap-model" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                Swap Model
              </Label>
              <select
                id="swap-model"
                value={swapModel}
                onChange={(e) => setSwapModel(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 text-white text-[9px] p-3 min-h-10 transition-colors duration-150 hover:border-white/20 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
              >
                {SWAP_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Face Restore */}
            <div className="space-y-2">
              <Label htmlFor="face-restore" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                Face Restore
              </Label>
              <select
                id="face-restore"
                value={faceRestoreModel}
                onChange={(e) => setFaceRestoreModel(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 text-white text-[9px] p-3 min-h-10 transition-colors duration-150 hover:border-white/20 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
              >
                {FACE_RESTORE_MODELS.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Restore Strength */}
            {faceRestoreModel !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="restore-strength" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                  Restore Strength: {restoreStrength.toFixed(1)}
                </Label>
                <Slider
                  value={[restoreStrength]}
                  onValueChange={([val]) => setRestoreStrength(val)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                  aria-label="Face restore strength from 0 to 1"
                  />
                </div>
              )}

              {/* Target Face Index */}
              <div className="space-y-2">
                <Label htmlFor="target-face-index" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                  Target Face Index
                </Label>
                <select
                  id="target-face-index"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-black/40 text-white text-[9px] p-3 min-h-10 transition-colors duration-150 hover:border-white/20 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
                >
                  {TARGET_INDICES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ResultCard result={result} accentColor="#ff2d78" label="Result" />
          </div>
        </div>
      </div>
    </div>
  )
}
