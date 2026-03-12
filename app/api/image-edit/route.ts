import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getHFToken, fileToDataUrl, bufferToDataUrl, HFConfigError } from "@/lib/hf"

import { InferenceClient } from "@huggingface/inference"

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("credits")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("User fetch error:", profileError)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  const credits = userProfile?.credits ?? 0
  if (credits < 1) {
    return NextResponse.json(
      { message: "Insufficient credits. Please top up." },
      { status: 402 }
    )
  }

  const formData = await req.formData()
  const image = formData.get("image") as File | null
  const prompt = formData.get("prompt") as string | null

  if (!image || !prompt?.trim()) {
    return NextResponse.json(
      { message: "Image and prompt are required" },
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
      model: "Qwen/Qwen-Image-Edit-2511",
      inputs: image,
      parameters: {
        prompt: prompt.trim(),
        guidance_scale: 7,
      },
    })

    const resultBuf = await blob.arrayBuffer()
    const resultDataUrl = bufferToDataUrl(resultBuf, "image/png")

    const { error: generationError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        prompt: prompt.trim(),
        input_url: imageDataUrl,
        output_url: resultDataUrl,
        model_used: "Qwen/Qwen-Image-Edit-2511",
        credits_used: 1,
      })
      .select()
      .single()

    if (generationError) {
      console.error("Generation insert error:", generationError)
      return NextResponse.json(
        { message: "Failed to record generation" },
        { status: 500 }
      )
    }

    return NextResponse.json({ result: resultDataUrl })
  } catch (err) {
    console.error("[image-edit] Unexpected error:", err)
    return NextResponse.json(
      { message: "Failed to process image" },
      { status: 500 }
    )
  }
}
