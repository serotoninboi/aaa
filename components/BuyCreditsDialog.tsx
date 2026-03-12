'use client'

import { useCallback, useState } from 'react'
import { useCredits } from '@/lib/use-credits'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

interface CreditPackage {
  id: string
  credits: number
  price: number
  popular?: boolean
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'small', credits: 50, price: 5 },
  { id: 'medium', credits: 150, price: 12, popular: true },
  { id: 'large', credits: 500, price: 35 },
  { id: 'xlarge', credits: 1500, price: 90 },
]

export function BuyCreditsDialog() {
  const { purchaseCredits, isLoading, error } = useCredits()
  const [open, setOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handlePurchase = useCallback(async (pkg: CreditPackage) => {
    setLocalError(null)
    setSelectedPackage(pkg)

    try {
      const providerRef = `purchase-${Date.now()}`
      const result = await purchaseCredits({
        creditsAmount: pkg.credits,
        provider: 'pending', // Will be updated by payment provider
        providerRef,
      })

      // In a real app, redirect to payment provider here
      console.log('Purchase initiated:', result)
      setOpen(false)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Purchase failed')
    }
  }, [purchaseCredits])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogDescription>
            Choose a credit package to continue generating images
          </DialogDescription>
        </DialogHeader>

        {error || localError ? (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-500">{error || localError}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          {CREDIT_PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => handlePurchase(pkg)}
              disabled={isLoading || selectedPackage?.id === pkg.id}
              className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                selectedPackage?.id === pkg.id
                  ? 'border-[#ff2d78] bg-[#ff2d78]/10'
                  : pkg.popular
                    ? 'border-[#ffb4d7] bg-[#ffb4d7]/5 hover:border-[#ff2d78]'
                    : 'border-white/10 hover:border-white/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-2 bg-[#ff2d78] text-white text-xs font-bold px-2 py-1 rounded">
                  Popular
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-white">{pkg.credits}</span>
                <span className="text-xs text-[#7a6f6d]">credits</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#ffb4d7]">€{pkg.price}</div>
              {selectedPackage?.id === pkg.id && (
                <div className="mt-2 text-xs text-[#ffb4d7]">Processing...</div>
              )}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#7a6f6d] space-y-1">
          <p>• 1 credit = 1 image generation</p>
          <p>• Prices are in EUR</p>
          <p>• Credits never expire</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
