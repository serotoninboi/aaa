import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Registration is now handled by Clerk - this endpoint is for compatibility only
    return NextResponse.json({ 
      user: { 
        id: 'temp-id', 
        name: name.trim(), 
        email: normalizedEmail, 
        credits: 0 
      } 
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
