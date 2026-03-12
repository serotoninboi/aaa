import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { name, email, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    
    // Check if user already exists in database
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (existingUser) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 })
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: name.trim() },
      },
    })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!data.user) {
      return NextResponse.json({ message: 'User creation failed' }, { status: 500 })
    }

    // Fetch user profile from database (should be created by database trigger)
    const { data: userProfile } = await supabase
      .from('users')
      .select('id, name, email, credits')
      .eq('id', data.user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 })
    }

    return NextResponse.json({ user: userProfile }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
