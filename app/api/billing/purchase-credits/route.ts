import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { creditsAmount: rawCredits, provider: rawProvider, providerRef } =
      await request.json()

    const creditsAmount = Number(rawCredits)
    const provider = typeof rawProvider === 'string' ? rawProvider.trim() : ''

    if (!Number.isFinite(creditsAmount) || creditsAmount <= 0 || !provider) {
      return NextResponse.json(
        { error: 'Credits amount and provider are required' },
        { status: 400 }
      )
    }

    const pricePerCredit = 0.1
    const amount = Number((creditsAmount * pricePerCredit).toFixed(2))

    // Billing recorded locally (no database storage)
    console.log('[billing] Purchase request created', { userId, creditsAmount, provider })

    return NextResponse.json({
      success: true,
      billing: {
        id: 'temp-id',
        user_id: userId,
        amount,
        currency: 'EUR',
        credits_added: creditsAmount,
        status: 'pending',
        provider,
        provider_ref: providerRef ?? null,
      },
      amount,
      creditsAmount,
    })
  } catch (error) {
    console.error('Billing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
