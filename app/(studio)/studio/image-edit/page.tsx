'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { DropZone } from '@/components/DropZone'
import { ResultPanel } from '@/components/ResultPanel'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Sparkles } from 'lucide-react'

const SIZE_OPTIONS = ['256', '512', '768']

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

      // Convert image to base64 for the API
      const arrayBuffer = await sourceImage.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: sourceImage.type })
      
      // Call the Qwen-Image-Edit API
      const client = await import('@gradio/client').then(m => m.Client.connect('serotoninboi/qwen-image-edit'))
      
      const result = await client.predict('/infer', {
        images: [
          {
            image: blob,
            caption: null,
          },
        ],
        prompt: prompt.trim(),
        seed: randomizeSeed ? Math.floor(Math.random() * 1000000) : seed,
        randomize_seed: randomizeSeed,
        true_guidance_scale: guidanceScale,
        num_inference_steps: numSteps,
        height: parseInt(height),
        width: parseInt(width),
        rewrite_prompt: rewritePrompt,
      })

      if (result.data && result.data.length > 0) {
        // result.data[0] is the result gallery
        // result.data[1] is the seed used
        const outputGallery = result.data[0]
        const usedSeed = result.data[1]

        if (outputGallery && outputGallery[0]) {
          setResult(outputGallery[0].image.url)
          setResultSeed(usedSeed)
        } else {
          throw new Error('No output generated')
        }
      } else {
        throw new Error('Invalid response from image edit API')
      }
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
        {/* Header */}
        <header className="rounded-[28px] border border-white/10 bg-black/60 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={24} className="text-primary" />
            <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-[#c3b5f0]">Image Lab</p>
          </div>
          <h1 className="text-4xl font-display font-bold text-white">Image Editor</h1>
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#8f8397]">Edit images with AI-powered prompt guidance</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Image Input */}
            <div className="rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#7a6f6d] mb-4">Source Image</p>
              <DropZone onFile={handleSourceImage} />
              {sourcePreview && (
                <img
                  src={sourcePreview}
                  alt="Source"
                  className="mt-4 h-64 w-full rounded border-2 border-primary/30 object-cover"
                />
              )}
            </div>

            {/* Prompt */}
            <div className="rounded-[32px] border border-white/10 bg-black/60 p-6 space-y-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#7a6f6d]">Edit Prompt</Label>
              <Textarea
                placeholder="Describe how you want to edit the image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20 resize-none border border-white/10 bg-black/40 text-white placeholder:text-[#7b6c91]"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="text-xs uppercase tracking-[0.3em]">
                {error}
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!sourceImage || !prompt.trim() || loading}
                className="flex-1 rounded-2xl py-3 px-4 bg-gradient-to-r from-[#ff2d78] to-[#a55bff] text-white font-mono text-[11px] font-bold uppercase tracking-[0.4em] transition-all hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Edit Image'}
              </button>
              <button
                onClick={clearImage}
                className="rounded-2xl py-3 px-4 border-2 border-white/10 text-[#7a6f6d] font-mono text-[11px] font-bold uppercase tracking-[0.4em] transition-all hover:border-[#ff2d78] hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Panel - Settings & Result */}
          <div className="space-y-6">
            {/* Advanced Settings */}
            <div className="rounded-[32px] border border-white/10 bg-black/60 p-6 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#7a6f6d]">Settings</p>

              {/* Seed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                    Seed: {seed}
                  </Label>
                  <button
                    onClick={() => setRandomizeSeed(!randomizeSeed)}
                    className={`text-[9px] font-mono uppercase px-2 py-1 rounded transition ${
                      randomizeSeed
                        ? 'bg-[#ff2d78]/30 text-[#ff2d78]'
                        : 'bg-white/10 text-[#7a6f6d]'
                    }`}
                  >
                    {randomizeSeed ? 'Random' : 'Fixed'}
                  </button>
                </div>
                {!randomizeSeed && (
                  <Slider
                    value={[seed]}
                    onValueChange={([v]) => setSeed(v)}
                    min={0}
                    max={1000000}
                    step={1}
                    className="w-full"
                  />
                )}
              </div>

              {/* Guidance Scale */}
              <div className="space-y-2">
                <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                  Guidance Scale: {guidanceScale.toFixed(1)}
                </Label>
                <Slider
                  value={[guidanceScale]}
                  onValueChange={([v]) => setGuidanceScale(v)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Inference Steps */}
              <div className="space-y-2">
                <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                  Steps: {numSteps}
                </Label>
                <Slider
                  value={[numSteps]}
                  onValueChange={([v]) => setNumSteps(v)}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">Height</Label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded border border-white/10 bg-black/40 text-white text-[9px] p-2"
                  >
                    {SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">Width</Label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full rounded border border-white/10 bg-black/40 text-white text-[9px] p-2"
                  >
                    {SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                    Randomize Seed
                  </Label>
                  <Switch
                    checked={randomizeSeed}
                    onCheckedChange={setRandomizeSeed}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
                    Rewrite Prompt
                  </Label>
                  <Switch
                    checked={rewritePrompt}
                    onCheckedChange={setRewritePrompt}
                  />
                </div>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(150deg,_rgba(255,45,120,0.05),_rgba(5,0,10,0.85))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
                <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#7a6f6d] mb-3">Result</p>
                <img
                  src={result}
                  alt="Edited result"
                  className="w-full rounded border border-white/10"
                />
                <p className="text-[8px] text-[#7a6f6d] mt-2">Seed: {resultSeed}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
