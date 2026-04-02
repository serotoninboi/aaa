'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { DropZone } from '@/components/DropZone'
import { ResultPanel } from '@/components/ResultPanel'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Sparkles, Zap } from 'lucide-react'

const SWAP_MODELS = [
  { value: 'inswapper_128.onnx', label: 'InSwapper 128 (Fast)' },
  { value: 'hyperswap_1b_256.onnx', label: 'HyperSwap 1B (Quality)' },
]

const FACE_RESTORE_MODELS = [
  { value: 'none', label: 'None' },
  { value: 'gfpgan', label: 'GFPGAN' },
  { value: 'restoreformer', label: 'RestoreFormer' },
]

const TARGET_INDICES = ['0', '1', '2', '3']

export default function FaceSwapPage() {
  const { getToken } = useAuth()
  const [sourceImage, setSourceImage] = useState<File | null>(null)
  const [sourcePreview, setSourcePreview] = useState<string | null>(null)
  const [targetImage, setTargetImage] = useState<File | null>(null)
  const [targetPreview, setTargetPreview] = useState<string | null>(null)
  const [targetIndex, setTargetIndex] = useState('0')
  const [swapModel, setSwapModel] = useState('inswapper_128.onnx')
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
      formData.append('targetIndex', targetIndex)
      formData.append('swapModel', swapModel)
      formData.append('faceRestoreModel', faceRestoreModel)
      formData.append('restoreStrength', restoreStrength.toString())

      const response = await fetch('/api/image-edit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-primary" />
            <h1 className="font-pixel text-3xl text-primary neon-cyan">FACE SWAP</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Seamlessly swap faces between images with advanced restoration options
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Panel - Controls */}
          <div className="space-y-4">
            {/* Source Image */}
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase tracking-wider">Source Image</Label>
              <DropZone onFile={handleSourceImage} />
              {sourcePreview && (
                <img
                  src={sourcePreview}
                  alt="Source"
                  className="h-64 w-full rounded border-2 border-primary/30 object-cover"
                />
              )}
            </div>

            {/* Target Image */}
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase tracking-wider">Target Image</Label>
              <DropZone onFile={handleTargetImage} />
              {targetPreview && (
                <img
                  src={targetPreview}
                  alt="Target"
                  className="h-64 w-full rounded border-2 border-primary/30 object-cover"
                />
              )}
            </div>

            {/* Models & Settings */}
            <div className="space-y-3 rounded border-2 border-primary/20 bg-primary/5 p-4">
              <Label className="text-xs font-mono uppercase tracking-wider">Swap Model</Label>
              <Select
                options={SWAP_MODELS}
                value={swapModel}
                onChange={e => setSwapModel(e.target.value)}
                className="h-8 w-full"
              />

              <Label className="text-xs font-mono uppercase tracking-wider">Face Restore</Label>
              <Select
                options={FACE_RESTORE_MODELS}
                value={faceRestoreModel}
                onChange={e => setFaceRestoreModel(e.target.value)}
                className="h-8 w-full"
              />

              {faceRestoreModel !== 'none' && (
                <>
                  <Label className="text-xs font-mono uppercase tracking-wider">
                    Restore Strength: {restoreStrength.toFixed(1)}
                  </Label>
                  <Slider
                    value={[restoreStrength]}
                    onValueChange={([val]) => setRestoreStrength(val)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </>
              )}

              <Label className="text-xs font-mono uppercase tracking-wider">Target Face Index</Label>
              <Select
                options={TARGET_INDICES.map(i => ({ value: i, label: i }))}
                value={targetIndex}
                onChange={e => setTargetIndex(e.target.value)}
                className="h-8 w-full"
              />
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!sourceImage || !targetImage || loading}
                className="flex-1 rounded border-2 border-primary bg-primary/20 px-4 py-2 font-mono text-sm uppercase tracking-wider text-primary transition-all hover:glow-cyan disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Swap'}
              </button>
              <button
                onClick={clear}
                className="rounded border-2 border-border px-4 py-2 font-mono text-sm uppercase tracking-wider text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Panel - Result */}
          <div>
            <ResultPanel result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
