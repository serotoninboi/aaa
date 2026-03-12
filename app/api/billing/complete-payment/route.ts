import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { billingId } = await req.json()
    if (!billingId) {
      return NextResponse.json({ message: 'Billing ID is required' }, { status: 400 })
    }

    const { data: billing, error: billingError } = await supabase
      .from('billing')
      .select('*')
      .eq('id', billingId)
      .eq('user_id', session.user.id)
      .single()

    if (billingError) {
      return NextResponse.json(
        { message: billingError.message },
        { status: billingError.code === 'PGRST116' ? 404 : 500 }
      )
    }

    if (billing.status?.toLowerCase() !== 'pending') {
      return NextResponse.json(
        { message: 'Payment record is not pending' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('billing')
      .update({ status: 'completed' })
      .eq('id', billingId)
      .eq('user_id', session.user.id)

    if (updateError) {
      console.error('Billing update error:', updateError)
      return NextResponse.json(
        { message: 'Failed to update payment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Payment completed successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
