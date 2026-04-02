'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Zap } from 'lucide-react'

export function CreditsDisplay() {
  const { user } = useUser()
  const [credits, setCredits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    const fetchCredits = async () => {
      try {
        const response = await fetch('/api/user/me')
        if (response.ok) {
          const data = await response.json()
          setCredits(data.user?.credits ?? 0)
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredits()
  }, [user])

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
        {credits} Credits
      </span>
    </div>
  )
}
