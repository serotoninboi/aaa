import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getHFToken,
  fileToDataUrl,
  bufferToDataUrl,
  HFConfigError,
  HFModelError,
} from '@/lib/hf'
import { InferenceClient } from '@huggingface/inference'

export async function POST(req: NextRequest) {
  // Get authenticated user from Clerk
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }



  const formData = await req.formData()
  const image = formData.get('image') as File | null
  const prompt = formData.get('pose') as string | null

  if (!image || !prompt?.trim()) {
    return NextResponse.json(
      { message: 'Image and pose description are required' },
      { status: 400 }
    )
  }

  let hfToken: string
  try {
    hfToken = getHFToken()
  } catch (err) {
    if (err instanceof HFConfigError) {
      return NextResponse.json({ message: err.message }, { status: 503 })
    }
    throw err
  }

  const hf = new InferenceClient(hfToken)

  try {
    const imageDataUrl = await fileToDataUrl(image)

    const blob = await hf.imageToImage({
      model: 'Qwen/Qwen-Image-Edit-2511',
      inputs: image,
      parameters: {
        prompt: prompt.trim(),
        guidance_scale: 7,
      },
    })

    const resultBuf = await blob.arrayBuffer()
    const resultDataUrl = bufferToDataUrl(resultBuf, 'image/png')

    // Generation logged locally (no database storage)
    console.log('[pose-edit] Generation successful', { userId, prompt: prompt.trim() })

    return NextResponse.json({ result: resultDataUrl })
  } catch (err) {
    if (err instanceof HFModelError) {
      if (err.status === 503) {
        return NextResponse.json(
          {
            message:
              'Pose model is still loading after retries — please try again in a moment',
          },
          { status: 503 }
        )
      }
      return NextResponse.json({ message: err.message }, { status: 502 })
    }
    console.error('[pose-edit] Unexpected error:', err)
    return NextResponse.json({ message: 'Failed to process pose' }, { status: 500 })
  }
}
