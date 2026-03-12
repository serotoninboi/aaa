import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { email, password } = await req.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (error) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    // Fetch user profile from database
    const { data: userProfile } = await supabase
      .from('users')
      .select('id, name, email, credits')
      .eq('id', data.user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 })
    }

    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
