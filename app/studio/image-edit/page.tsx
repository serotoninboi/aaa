'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ImageInput } from '@/components/ImageInput'
import { GeneratorSettings } from '@/components/GeneratorSettings'
import { GeneratorHeader } from '@/components/GeneratorHeader'
import { ResultCard } from '@/components/ResultCard'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'

export default function ImageEditPage() {
  const { getToken } = useAuth()
  const [sourceImage, setSourceImage] = useState<File | null>(null)
  const [sourcePreview, setSourcePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState(0)
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [guidanceScale, setGuidanceScale] = useState(1)
  const [numSteps, setNumSteps] = useState(4)
  const [height, setHeight] = useState('256')
  const [width, setWidth] = useState('256')
  const [rewritePrompt, setRewritePrompt] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [resultSeed, setResultSeed] = useState(0)
  const [error, setError] = useState('')

  const handleSourceImage = useCallback((f: File) => {
    setSourceImage(f)
    setResult(null)
    setError('')
    const r = new FileReader()
    r.onload = () => setSourcePreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const clearImage = useCallback(() => {
    setSourceImage(null)
    setSourcePreview(null)
    setResult(null)
  }, [])

  const handleSubmit = async () => {
    if (!sourceImage || !prompt.trim()) {
      setError('Upload an image and provide an editing prompt')
      return
    }

    setLoading(true)
    setError('')
    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('image', sourceImage)
      formData.append('prompt', prompt.trim())
      formData.append('seed', randomizeSeed ? Math.floor(Math.random() * 1000000) : seed.toString())
      formData.append('randomizeSeed', randomizeSeed.toString())
      formData.append('guidanceScale', guidanceScale.toString())
      formData.append('numSteps', numSteps.toString())
      formData.append('height', height)
      formData.append('width', width)
      formData.append('rewritePrompt', rewritePrompt.toString())

      const response = await fetch('/api/image-edit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Image edit failed')
      }

      const data = await response.json()
      setResult(data.result)
      setResultSeed(data.seed)
    } catch (err) {
      console.error('Image edit error:', err)
      setError(err instanceof Error ? err.message : 'Failed to edit image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-4">
        <GeneratorHeader
          title="Image Editor"
          description="Edit images with AI-powered prompt guidance"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <ImageInput
              label="Source Image"
              preview={sourcePreview}
              file={sourceImage}
              onFileChange={handleSourceImage}
              onClear={clearImage}
            />

            <div className="rounded-[32px] border border-white/10 bg-black/60 p-6 space-y-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)] focus-within:border-white/20 transition-colors duration-200">
              <Label htmlFor="edit-prompt" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                Edit Prompt
              </Label>
              <Textarea
                id="edit-prompt"
                placeholder="Describe how you want to edit the image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20 resize-none rounded-lg border border-white/10 bg-black/40 text-white placeholder:text-[#7b6c91] text-[9px] p-3 transition-colors duration-150 hover:border-white/20 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
              />
              <p className="text-[8px] text-[#7a6f6d] leading-relaxed">
                Be specific: "change to blue", "add sunset", "make it more vibrant"
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="text-xs uppercase tracking-[0.3em]">
                {error}
              </Alert>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!sourceImage || !prompt.trim() || loading}
                aria-busy={loading}
                className="flex-1 rounded-2xl py-3 px-4 bg-gradient-to-r from-[#ff2d78] to-[#a55bff] text-white font-mono text-[11px] font-bold uppercase tracking-[0.4em] min-h-12 transition-all duration-150 hover:shadow-[0_0_25px_rgba(255,45,120,0.6)] focus:outline-none focus:ring-2 focus:ring-[#ff2d78] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none"
              >
                {loading ? 'Processing...' : 'Edit Image'}
              </button>
              <button
                onClick={clearImage}
                className="rounded-2xl py-3 px-4 border-2 border-white/10 text-[#a08fb7] font-mono text-[11px] font-bold uppercase tracking-[0.4em] min-h-12 transition-all duration-150 hover:border-[#ff2d78] hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
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
              showRewritePrompt={true}
              rewritePrompt={rewritePrompt}
              accentColor="#ff2d78"
              onSeedChange={setSeed}
              onRandomizeSeedChange={setRandomizeSeed}
              onGuidanceScaleChange={setGuidanceScale}
              onNumStepsChange={setNumSteps}
              onHeightChange={setHeight}
              onWidthChange={setWidth}
              onRewritePromptChange={setRewritePrompt}
            />

            <ResultCard result={result} seed={resultSeed} accentColor="#ff2d78" label="Result" />
          </div>
        </div>
      </div>
    </div>
  )
}
