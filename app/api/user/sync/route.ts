import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getOrCreateUser, getUserCredits } from '@/lib/credits'

// Sync Clerk user to local DB and return user info with credits
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
    const name = clerkUser.firstName || clerkUser.lastName
      ? `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim()
      : null

    // Ensure user exists in local DB
    await getOrCreateUser(userId, email, name)

    // Get credits
    const credits = await getUserCredits(userId)

    return NextResponse.json({
      id: userId,
      name,
      email,
      credits,
    })
  } catch (error) {
    console.error('[user/sync]', error)
    return NextResponse.json({ message: 'Failed to sync user' }, { status: 500 })
  }
}