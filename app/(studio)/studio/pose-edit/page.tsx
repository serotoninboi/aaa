'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ImageInput } from '@/components/ImageInput'
import { GeneratorSettings } from '@/components/GeneratorSettings'
import { GeneratorHeader } from '@/components/GeneratorHeader'
import { ResultCard } from '@/components/ResultCard'
import { Alert } from '@/components/ui/alert'
import { Sparkles } from 'lucide-react'

export default function PoseEditPage() {
  const { getToken } = useAuth()
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [referencePreview, setReferencePreview] = useState<string | null>(null)
  const [poseImage, setPoseImage] = useState<File | null>(null)
  const [posePreview, setPosePreview] = useState<string | null>(null)
  const [seed, setSeed] = useState(0)
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [guidanceScale, setGuidanceScale] = useState(1)
  const [numSteps, setNumSteps] = useState(4)
  const [height, setHeight] = useState('256')
  const [width, setWidth] = useState('256')
  const [rewritePrompt, setRewritePrompt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [resultSeed, setResultSeed] = useState(0)
  const [error, setError] = useState('')

  const handleReferenceImage = useCallback((f: File) => {
    setReferenceImage(f)
    setResult(null)
    setError('')
    const r = new FileReader()
    r.onload = () => setReferencePreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const handlePoseImage = useCallback((f: File) => {
    setPoseImage(f)
    setResult(null)
    setError('')
    const r = new FileReader()
    r.onload = () => setPosePreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const clear = useCallback(() => {
    setReferenceImage(null)
    setReferencePreview(null)
    setPoseImage(null)
    setPosePreview(null)
    setResult(null)
  }, [])

  const handleSubmit = async () => {
    if (!referenceImage || !poseImage) {
      setError('Upload both reference and pose images')
      return
    }

    setLoading(true)
    setError('')
    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('referenceImage', referenceImage)
      formData.append('poseImage', poseImage)
      formData.append('seed', randomizeSeed ? Math.floor(Math.random() * 1000000).toString() : seed.toString())
      formData.append('randomizeSeed', randomizeSeed.toString())
      formData.append('guidanceScale', guidanceScale.toString())
      formData.append('numSteps', numSteps.toString())
      formData.append('height', height)
      formData.append('width', width)
      formData.append('rewritePrompt', rewritePrompt.toString())

      const response = await fetch('/api/pose-edit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Pose edit failed')
      }

      const data = await response.json()
      setResult(data.result)
      setResultSeed(data.seed)
    } catch (err) {
      console.error('Pose edit error:', err)
      setError(err instanceof Error ? err.message : 'Failed to edit pose')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(165,91,255,0.14),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-4">
        <GeneratorHeader
          title="Pose Changer"
          description="Retarget any character with dynamic motion"
          labLabel="Pose Lab"
          labColor="#f0dffb"
          icon={Sparkles}
          iconColor="text-primary"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <ImageInput
              label="Reference Image"
              preview={referencePreview}
              file={referenceImage}
              onFileChange={handleReferenceImage}
              onClear={() => {
                setReferenceImage(null)
                setReferencePreview(null)
              }}
            />

            <ImageInput
              label="Pose Image"
              preview={posePreview}
              file={poseImage}
              onFileChange={handlePoseImage}
              onClear={() => {
                setPoseImage(null)
                setPosePreview(null)
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
                disabled={!referenceImage || !poseImage || loading}
                aria-busy={loading}
                className="flex-1 rounded-2xl py-3 px-4 bg-gradient-to-r from-[#a55bff] to-[#ff2d78] text-white font-mono text-[11px] font-bold uppercase tracking-[0.4em] min-h-12 transition-all duration-150 hover:shadow-[0_0_25px_rgba(165,91,255,0.6)] focus:outline-none focus:ring-2 focus:ring-[#a55bff] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none"
              >
                {loading ? 'Processing...' : 'Apply Pose'}
              </button>
              <button
                onClick={clear}
                className="rounded-2xl py-3 px-4 border-2 border-white/10 text-[#a08fb7] font-mono text-[11px] font-bold uppercase tracking-[0.4em] min-h-12 transition-all duration-150 hover:border-[#a55bff] hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Panel - Settings & Result */}
          <div className="space-y-6">
            <GeneratorSettings
              seed={seed}
              randomizeSeed={randomizeSeed}
              guidanceScale={guidanceScale}
              numSteps={numSteps}
              height={height}
              width={width}
              accentColor="#a55bff"
              onSeedChange={setSeed}
              onRandomizeSeedChange={setRandomizeSeed}
              onGuidanceScaleChange={setGuidanceScale}
              onNumStepsChange={setNumSteps}
              onHeightChange={setHeight}
              onWidthChange={setWidth}
            />

            <ResultCard result={result} seed={resultSeed} accentColor="#a55bff" label="Result" />
          </div>
        </div>
      </div>
    </div>
  )
}
