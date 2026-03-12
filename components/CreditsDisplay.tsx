'use client'

import { useAuth } from '@/lib/auth-context'
import { Zap } from 'lucide-react'

export function CreditsDisplay() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2">
        <Zap className="h-4 w-4 text-[#ffb4d7] animate-pulse" />
        <span className="text-sm font-semibold text-white">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff2d78]/20 to-[#ffb4d7]/20 border border-[#ffb4d7]/30 px-3 py-2">
      <Zap className="h-4 w-4 text-[#ffb4d7]" />
      <span className="text-sm font-semibold text-white">
        {user?.credits ?? 0} Credits
      </span>
    </div>
  )
}
