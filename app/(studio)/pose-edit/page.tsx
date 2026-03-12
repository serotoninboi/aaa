'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DropZone } from '@/components/DropZone'
import { ResultPanel } from '@/components/ResultPanel'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

const POSE_PRESETS = [
  { id: 'standing', emoji: '🧍', label: 'Standing', desc: 'Neutral upright pose' },
  { id: 'sitting', emoji: '🪑', label: 'Sitting', desc: 'Graceful seated pose' },
  { id: 'walking', emoji: '🚶', label: 'Walking', desc: 'Forward motion with swagger' },
  { id: 'arms_up', emoji: '🙌', label: 'Arms up', desc: 'Open, triumphant posture' },
  { id: 'crossed', emoji: '🤗', label: 'Arms crossed', desc: 'Poised and confident' },
  { id: 'dancing', emoji: '💃', label: 'Dancing', desc: 'Dynamic stage motion' },
]

export default function PoseEditPage() {
  const { token } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState('')
  const [customPose, setCustomPose] = useState('')
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

  const activePose = customPose.trim() || selectedPreset

  const handleSubmit = async () => {
    if (!file || !activePose) {
      setError('Upload an image and select or describe a pose')
      return
    }

    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('pose', activePose)
      const res = await fetch('/api/pose-edit', {
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
    <div className="relative py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(165,91,255,0.14),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-4">
        <header className="rounded-[28px] border border-white/10 bg-black/60 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
          <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-[#f0dffb]">Pose Lab</p>
          <h1 className="text-4xl font-display font-bold text-white">Pose Editor</h1>
          <p className="text-[12px] uppercase tracking-[0.3em] text-[#8f8397]">Retarget any character with a seductive whisper of motion</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6 rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#7a6f6d]">Source image</p>
              <DropZone onFile={handleFile} preview={preview} onClear={clear} />
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#6e627d]">Select pose</p>
              <div className="grid grid-cols-3 gap-2">
                {POSE_PRESETS.map(p => {
                  const isSelected = selectedPreset === p.desc && !customPose
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPreset(p.desc)
                        setCustomPose('')
                      }}
                      className={`flex flex-col gap-1 rounded-2xl border p-3 text-left text-[10px] font-mono uppercase tracking-[0.4em] transition ${
                        isSelected
                          ? 'border-[#ff6da0] bg-gradient-to-tr from-[#ff2d78]/30 to-[#a55bff]/20 text-white'
                          : 'border-white/10 bg-[#050005] text-[#a08fb7] hover:border-[#ff6da0] hover:text-white'
                      }`}
                    >
                      <span className="text-[18px]">{p.emoji}</span>
                      <span className="text-[11px] font-bold">{p.label}</span>
                      <span className="text-[9px] tracking-[0.5em] text-[#7a6f6d]">{p.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Input
              label="Or describe custom pose"
              placeholder="e.g. Person leaping with arms spread wide"
              value={customPose}
              onChange={e => {
                setCustomPose(e.target.value)
                setSelectedPreset('')
              }}
              className="border border-white/10 bg-black/40 text-white placeholder:text-[#7b6c91]"
            />

            {error && <Alert variant="error" className="text-xs uppercase tracking-[0.3em]">{error}</Alert>}

            <button
              onClick={handleSubmit}
              disabled={loading || !file || !activePose}
              className="neon-button w-full rounded-2xl py-4 text-[11px] font-bold uppercase tracking-[0.4em]"
            >
              {loading ? 'Applying...' : 'Apply pose'}
            </button>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(140deg,_rgba(255,45,120,0.05),_rgba(5,0,10,0.85))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
            <ResultPanel result={result} loading={loading} label="Pose output" />
          </div>
        </div>
      </div>
    </div>
  )
}
