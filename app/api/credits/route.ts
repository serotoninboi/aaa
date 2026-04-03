import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserCredits } from '@/lib/credits'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const credits = await getUserCredits(userId)
    return NextResponse.json({ credits })
  } catch (error) {
    console.error('[credits]', error)
    return NextResponse.json({ message: 'Failed to fetch credits' }, { status: 500 })
  }
}