'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

const SIZE_OPTIONS = ['256', '512', '768']

interface GeneratorSettingsProps {
  seed: number
  randomizeSeed: boolean
  guidanceScale: number
  numSteps: number
  height: string
  width: string
  showRewritePrompt?: boolean
  rewritePrompt?: boolean
  accentColor?: string
  onSeedChange: (seed: number) => void
  onRandomizeSeedChange: (randomize: boolean) => void
  onGuidanceScaleChange: (scale: number) => void
  onNumStepsChange: (steps: number) => void
  onHeightChange: (height: string) => void
  onWidthChange: (width: string) => void
  onRewritePromptChange?: (rewrite: boolean) => void
}

export function GeneratorSettings({
  seed,
  randomizeSeed,
  guidanceScale,
  numSteps,
  height,
  width,
  showRewritePrompt = false,
  rewritePrompt = false,
  accentColor = '#ff2d78',
  onSeedChange,
  onRandomizeSeedChange,
  onGuidanceScaleChange,
  onNumStepsChange,
  onHeightChange,
  onWidthChange,
  onRewritePromptChange,
}: GeneratorSettingsProps) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-black/60 p-6 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] focus-within:border-white/20 transition-colors duration-200">
      <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
        Settings
      </p>

      {/* Seed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="seed-label" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
            Seed: {seed}
          </Label>
          <button
            onClick={() => onRandomizeSeedChange(!randomizeSeed)}
            aria-pressed={randomizeSeed}
            className="text-[9px] font-mono uppercase px-3 py-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black min-h-10 min-w-16"
            style={{
              backgroundColor: randomizeSeed ? `${accentColor}30` : 'rgba(255,255,255,0.1)',
              color: randomizeSeed ? accentColor : '#a08fb7',
              borderRadius: '8px',
            }}
          >
            {randomizeSeed ? 'Random' : 'Fixed'}
          </button>
        </div>
        {!randomizeSeed && (
          <Slider
            value={[seed]}
            onValueChange={([v]) => onSeedChange(v)}
            min={0}
            max={1000000}
            step={1}
            className="w-full"
            aria-label="Seed value"
          />
        )}
      </div>

      {/* Guidance Scale */}
      <div className="space-y-2">
        <Label htmlFor="guidance-scale" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
          Guidance Scale: {guidanceScale.toFixed(1)}
        </Label>
        <Slider
          value={[guidanceScale]}
          onValueChange={([v]) => onGuidanceScaleChange(v)}
          min={0.1}
          max={3}
          step={0.1}
          className="w-full"
          aria-label="Guidance scale from 0.1 to 3"
        />
        <p className="text-[8px] text-[#7a6f6d] leading-relaxed">
          Higher values follow your prompt more closely
        </p>
      </div>

      {/* Inference Steps */}
      <div className="space-y-2">
        <Label htmlFor="steps" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
          Steps: {numSteps}
        </Label>
        <Slider
          value={[numSteps]}
          onValueChange={([v]) => onNumStepsChange(v)}
          min={1}
          max={50}
          step={1}
          className="w-full"
          aria-label="Inference steps from 1 to 50"
        />
        <p className="text-[8px] text-[#7a6f6d] leading-relaxed">
          More steps = better quality but slower
        </p>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="height-select" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
            Height
          </Label>
          <select
            id="height-select"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/40 text-white text-[9px] p-3 min-h-10 transition-colors duration-150 hover:border-white/20 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
          >
            {SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="width-select" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
            Width
          </Label>
          <select
            id="width-select"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/40 text-white text-[9px] p-3 min-h-10 transition-colors duration-150 hover:border-white/20 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
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
      {showRewritePrompt && onRewritePromptChange && (
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <Label htmlFor="rewrite-prompt" className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#a08fb7]">
              Rewrite Prompt
            </Label>
            <Switch
              id="rewrite-prompt"
              checked={rewritePrompt}
              onCheckedChange={onRewritePromptChange}
              aria-label="Enable prompt rewriting"
            />
          </div>
          <p className="text-[8px] text-[#7a6f6d] leading-relaxed">
            AI will improve your prompt for better results
          </p>
        </div>
      )}
    </div>
  )
}
