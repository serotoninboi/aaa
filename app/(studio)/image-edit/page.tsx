'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DropZone } from '@/components/DropZone'
import { ResultPanel } from '@/components/ResultPanel'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'

const QUICK_PROMPTS = [
  'Change background to golden sunset',
  'Make it look like a vintage oil painting',
  'Add dramatic cinematic lighting',
  'Convert to soft watercolor style',
  'Apply neon cyberpunk color grading',
]

export default function ImageEditPage() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setError('')
    const r = new FileReader()
    r.onload = () => setPreview(r.result as string)
    r.readAsDataURL(f)
  }, [])

  const clear = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }, [])

  const handleSubmit = async () => {
    if (!file || !prompt.trim()) {
      setError('Upload an image and enter a prompt')
      return
    }

    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('prompt', prompt)
      const res = await fetch('/api/image-edit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-4">
        <header className="rounded-[28px] border border-white/10 bg-black/60 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
          <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-[#c3b5f0]">Image Lab</p>
          <h1 className="text-4xl font-display font-bold text-white">Image Editor</h1>
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#8f8397]">Describe your edit, AI executes with seductive precision</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#7a6f6d]">Source image</p>
              <DropZone onFile={handleFile} preview={preview} onClear={clear} />
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#6e627d]">Edit prompt</p>
              <Textarea
                label="Prompt"
                id="prompt"
                placeholder="Turn the background into a misty forest at dawn…"
                rows={4}
                className="rounded-2xl border border-white/10 bg-black/40 text-white placeholder:text-[#7c7092]"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#857a92]">Quick prompts</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="rounded-full border border-white/10 bg-[#130014] px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-[#ff96c7] transition hover:border-[#ff2d78] hover:text-white"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {error && <Alert variant="error" className="text-xs uppercase tracking-[0.3em]">{error}</Alert>}

            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="neon-button w-full rounded-2xl py-4 text-[11px] font-bold uppercase tracking-[0.4em]"
            >
              {loading ? 'Processing…' : 'Generate edit'}
            </button>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(150deg,_rgba(255,45,120,0.05),_rgba(5,0,10,0.85))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
            <ResultPanel result={result} loading={loading} label="Image output" />
          </div>
        </div>
      </div>
    </div>
  )
}
