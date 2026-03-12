import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile from database
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, credits, createdAt')
      .eq('id', session.user.id)
      .single()

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('User me error:', error)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
