import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, inputUrl, outputUrl, modelUsed } = await req.json()
    if (!prompt || !inputUrl || !outputUrl || !modelUsed) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Generation recorded locally (no database storage)
    console.log('[generations] Generation created', { userId, prompt, modelUsed })

    return NextResponse.json({ 
      generation: {
        id: 'temp-id',
        user_id: userId,
        prompt,
        input_url: inputUrl,
        output_url: outputUrl,
        model_used: modelUsed,
        credits_used: 1,
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
