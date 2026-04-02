import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { billingId } = await req.json()
    if (!billingId) {
      return NextResponse.json({ message: 'Billing ID is required' }, { status: 400 })
    }

    // Payment completed locally (no database storage)
    console.log('[billing] Payment completed', { userId, billingId })

    return NextResponse.json({ message: 'Payment completed successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
