import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Client } from "@gradio/client"

export async function POST(req: NextRequest) {
  // Get authenticated user from Clerk
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const image = formData.get("image") as File | null
    const prompt = (formData.get("prompt") as string) ?? ""
    const seed = parseInt((formData.get("seed") as string) ?? "0")
    const randomizeSeed = formData.get("randomizeSeed") === "true"
    const guidanceScale = parseFloat((formData.get("guidanceScale") as string) ?? "1")
    const numSteps = parseInt((formData.get("numSteps") as string) ?? "4")
    const height = parseInt((formData.get("height") as string) ?? "256")
    const width = parseInt((formData.get("width") as string) ?? "256")
    const rewritePrompt = formData.get("rewritePrompt") === "true"

    if (!image || !prompt.trim()) {
      return NextResponse.json(
        { message: "Image and prompt are required" },
        { status: 400 }
      )
    }

    console.log("[image-edit] Processing Qwen image edit request", {
      image: image.name,
      prompt,
      seed,
      guidanceScale,
      numSteps,
      height,
      width,
    })

    const imageBlob = new Blob([await image.arrayBuffer()], {
      type: image.type || "image/png",
    })

    // Connect to Qwen image edit space
    const client = await Client.connect("serotoninboi/qwen-image-edit")
    const result = await client.predict("/infer", {
      images: [
        {
          image: imageBlob,
          caption: null,
        },
      ],
      prompt: prompt.trim(),
      seed: randomizeSeed ? Math.floor(Math.random() * 1000000) : seed,
      true_guidance_scale: guidanceScale,
      num_inference_steps: numSteps,
      height,
      width,
      rewrite_prompt: rewritePrompt,
    })

    const outputGallery = result.data[0]
    const usedSeed = result.data[1]

    if (!outputGallery || !outputGallery[0]) {
      throw new Error("No image generated from Qwen API")
    }

    const generatedImage = outputGallery[0].image.url
    console.log("[image-edit] Image edit successful:", { generatedImage, seed: usedSeed })

    return NextResponse.json({ result: generatedImage, seed: usedSeed })
  } catch (err) {
    console.error("[image-edit] Unexpected error:", err)
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { message: `Failed to edit image: ${errorMessage}` },
      { status: 500 }
    )
  }
}
