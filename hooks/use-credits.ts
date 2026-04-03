'use client'

import { useCallback, useState } from 'react'
import { useUser } from '@clerk/nextjs'

interface CreditPurchaseOptions {
  creditsAmount: number
  provider: string
  providerRef?: string
}

interface GenerationOptions {
  prompt?: string
  inputUrl?: string
  outputUrl: string
  modelUsed: string
  creditsUsed?: number
}

export function useCredits() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState(0)

  // Purchase credits
  const purchaseCredits = useCallback(
    async (options: CreditPurchaseOptions) => {
      if (!user) throw new Error('Not authenticated')

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/billing/purchase-credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to purchase credits')
        }

        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [user]
  )

  // Complete payment
  const completePayment = useCallback(
    async (billingId: string, status: 'completed' | 'failed') => {
      if (!user) throw new Error('Not authenticated')

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/billing/complete-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billingId, status }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to complete payment')
        }

        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [user]
  )

  // Record generation
  const recordGeneration = useCallback(
    async (options: GenerationOptions) => {
      if (!user) throw new Error('Not authenticated')

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/generations/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to record generation')
        }

        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [user]
  )

  return {
    credits,
    isLoading,
    error,
    purchaseCredits,
    completePayment,
    recordGeneration,
  }
}
