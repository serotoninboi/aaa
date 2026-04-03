import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateUser } from '@/lib/credits'

// Clerk webhook handler for user sync
// Register this endpoint in Clerk Dashboard: Webhooks -> User Created/Updated/Deleted
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    // TODO: Verify webhook signature in production
    // const svixHeaders = req.headers.get('svix-id')
    // const svixTimestamp = req.headers.get('svix-timestamp')
    // const svixSignature = req.headers.get('svix-signature')

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        const { id, primary_email_address, first_name, last_name } = data
        const email = primary_email_address
        const name = [first_name, last_name].filter(Boolean).join(' ') || null

        await getOrCreateUser(id, email, name)
        break
      }

      case 'user.deleted': {
        // TODO: Implement soft delete or user removal
        console.log('[clerk-webhook] User deleted:', data.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[clerk-webhook]', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}