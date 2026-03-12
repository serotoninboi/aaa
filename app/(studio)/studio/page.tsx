'use client'
import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { DropZone } from '@/components/DropZone'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { Sparkles, Zap, Bolt, Clock3 } from 'lucide-react'

const FOCUS_TABS = [
  { id: 'lighting', label: 'Lighting canvas', desc: 'Control gradients, flares, and volumetric haze.' },
  { id: 'pose', label: 'Pose director', desc: 'Fine-tune limbs, gaze, and cinematic momentum.' },
  { id: 'finish', label: 'Finishing polish', desc: 'Add grain, glow, and soft vignette flourishes.' },
]

const QUICK_PROMPTS = [
  { label: 'Sunrise Aura', prompt: 'Melt the scene in molten light, draw soft smoke trails.' },
  { label: 'Digital Noir', prompt: 'Rainy alley, neon edges, hyper-detailed reflections.' },
  { label: 'Eternal Bronze', prompt: 'Warm, saturated, bronze skin against charcoal backdrop.' },
]

export default function StudioPage() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [activeFocus, setActiveFocus] = useState('lighting')
  const [history, setHistory] = useState<string[]>([])

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(f)
  }, [])

  const clear = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }, [])

  const handleSubmit = async () => {
    if (!file || !prompt.trim()) {
      setError('Upload an image and describe your vision')
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
      setHistory(current => [data.result, ...current].slice(0, 3))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,45,120,0.15),_transparent_50%),_radial-gradient(circle_at_10%_80%,_rgba(165,91,255,0.25),_transparent_50%)]">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(140deg, rgba(255,45,120,0.1), transparent 60%)' }} />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 py-12 lg:py-16">
        <section className="rounded-[36px] border border-white/10 bg-black/60 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.8)]">
          <p className="text-[10px] uppercase tracking-[0.6em] text-[#d4c7f5]">Studio Core</p>
          <h1 className="mt-3 text-4xl font-oxanium uppercase tracking-[0.2em] text-white sm:text-5xl">
            Command your seductive edit flow
          </h1>
          <p className="mt-4 max-w-3xl readable-copy text-[13px] tracking-[0.35em] text-[#b7accd]">
            Three sections keep you grounded: the navigation deck, the generative canvas, and the cinematic chronicle.
          </p>
          <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-[#f2e8ff]">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-3">
              <Zap size={18} className="text-[#ff6da0]" />
              Real-time experiment stream
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-3">
              <Sparkles size={18} className="text-[#a55bff]" />
              120 frame pose recall
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="neon-panel relative space-y-6 overflow-hidden rounded-[34px] border border-white/10 p-6">
            <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle,_rgba(255,45,120,0.18),_transparent_60%)]" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.5em] text-[#d4c7f5]">
                <span>Command Deck</span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-[10px]">Live</span>
              </div>
              <DropZone onFile={handleFile} preview={preview} onClear={clear} />
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.5em] text-[#b7accd]">Prompt ritual</p>
                <Textarea
                  placeholder="Describe the transformation with fearless precision..."
                  className="border border-white/10 bg-black/50 text-sm text-white placeholder:text-[#7c7092]"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {QUICK_PROMPTS.map(item => (
                  <button
                    key={item.label}
                    onClick={() => setPrompt(item.prompt)}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#ffc3e5] transition hover:border-[#ff6da0] hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {error && (
                <Alert variant="error" className="text-xs uppercase tracking-[0.3em]">
                  {error}
                </Alert>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading || !file}
                className="neon-button w-full rounded-2xl px-6 py-4 text-[10px]"
              >
                {loading ? 'Forging mid-air…' : 'Summon the edit'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {FOCUS_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFocus(tab.id)}
                className={`flex items-center justify-between rounded-[30px] border px-5 py-4 text-[11px] uppercase tracking-[0.4em] text-white transition ${
                  activeFocus === tab.id
                    ? 'border-[#ff6da0] bg-gradient-to-r from-[#ff2d78]/30 to-[#a55bff]/20 text-white'
                    : 'border-white/10 text-[#b7accd] hover:border-[#ff6da0]/40'
                }`}
              >
                <div>
                  <p className="text-[8px] tracking-[0.6em] text-[#d4c7f5]">Focus</p>
                  <p className="font-oxanium text-lg">{tab.label}</p>
                </div>
                <Bolt size={24} className="text-[#ff6da0]" />
              </button>
            ))}
            <p className="readable-copy text-[11px] tracking-[0.4em] text-[#a8a0c4]">
              {FOCUS_TABS.find(f => f.id === activeFocus)?.desc}
            </p>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-[#f6e4ff]">
              <Clock3 size={16} />
              Live computation latency 97ms
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-black/70 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,45,120,0.12),_transparent_60%)]" />
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.5em] text-[#d6cfee]">
                <span>Preview</span>
                <span>Streaming</span>
              </div>
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.img
                    key="result"
                    src={result}
                    alt="Result"
                    className="relative z-10 h-[420px] w-full rounded-[28px] object-cover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  />
                ) : loading ? (
                  <motion.div
                    key="loading"
                    className="relative z-10 flex h-[420px] flex-col items-center justify-center gap-4 rounded-[28px] border border-white/10 bg-gradient-to-b from-[#050006] to-[#020005] text-center text-sm uppercase tracking-[0.3em] text-[#d1c5ef]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10">
                      <Sparkles size={32} className="text-[#ff6da0]" />
                    </div>
                    <p>Forging composition…</p>
                    <p className="text-[10px] text-[#8f8397]">AI cores 49% utilization</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="relative z-10 flex h-[420px] flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-white/20 bg-gradient-to-b from-[#060109] to-[#020003] text-center text-sm uppercase tracking-[0.3em] text-[#a08fb7]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p>Upload an image + prompt to see the magic</p>
                    <p className="text-[10px] text-[#6b6378]">Studio history auto-saves every variation</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6 rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,_rgba(255,45,120,0.08),_rgba(10,0,10,0.9))] p-6">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-[#cfc9e7]">
              <span>Studio chronicle</span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-[9px]">Latest</span>
            </div>
            <div className="space-y-4">
              {history.length ? (
                history.map(entry => (
                  <div key={entry} className="rounded-3xl border border-white/10 bg-black/60 p-4 text-[11px] text-[#d1c5ef]">
                    <p className="text-[11px] tracking-[0.3em]">Result snapshot</p>
                    <p className="readable-copy text-[10px] text-[#8f8397]">{entry.slice(0, 22)}…</p>
                  </div>
                ))
              ) : (
                <p className="readable-copy text-[#8c879c]">Generate a look to populate your chronicle.</p>
              )}
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/60 p-4">
              <p className="section-lead">Session stats</p>
              <p className="text-3xl font-oxanium text-white">{history.length} edits</p>
              <p className="readable-copy text-[10px] text-[#ada0c2]">Updated live every time you push the button</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
