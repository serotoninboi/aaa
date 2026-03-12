import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
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

    const { data: billing, error: billingError } = await supabase
      .from('billing')
      .insert({
        user_id: user.id,
        amount,
        currency: 'EUR',
        credits_added: creditsAmount,
        status: 'pending',
        provider,
        provider_ref: providerRef ?? null,
      })
      .select()
      .single()

    if (billingError) {
      console.error('Billing insert error:', billingError)
      return NextResponse.json(
        { error: 'Failed to create billing record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      billing,
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
