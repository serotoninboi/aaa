import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, inputUrl, outputUrl, modelUsed } = await req.json()
    if (!prompt || !inputUrl || !outputUrl || !modelUsed) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const { data: generation, error: generationError } = await supabase
      .from('generations')
      .insert({
        user_id: session.user.id,
        prompt,
        input_url: inputUrl,
        output_url: outputUrl,
        model_used: modelUsed,
        credits_used: 1,
      })
      .select()
      .single()

    if (generationError) {
      console.error('Generation insert error:', generationError)
      return NextResponse.json(
        { message: 'Failed to record generation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ generation })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
