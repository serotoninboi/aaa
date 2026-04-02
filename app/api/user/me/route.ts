import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(_req: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Return basic user info
    return NextResponse.json({ 
      user: {
        id: userId,
        credits: 0,
      }
    })
  } catch (error) {
    console.error('User me error:', error)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
