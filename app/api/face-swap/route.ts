import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Client, handle_file } from "@gradio/client"

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const sourceImage = formData.get("sourceImage") as File | null
    const targetImage = formData.get("targetImage") as File | null
    const targetIndex = (formData.get("targetIndex") as string) ?? "0"
    const swapModel = (formData.get("swapModel") as string) ?? "hyperswap_1b_256.onnx"
    const faceRestoreModel = (formData.get("faceRestoreModel") as string) ?? "none"
    const restoreStrength = parseFloat((formData.get("restoreStrength") as string) ?? "0.7")

    if (!sourceImage || !targetImage) {
      return NextResponse.json(
        { message: "Source and target images are required" },
        { status: 400 }
      )
    }

    console.log("[face-swap] Processing request", {
      sourceImage: sourceImage.name,
      targetImage: targetImage.name,
      targetIndex,
      swapModel,
      faceRestoreModel,
      restoreStrength,
    })

    // Gradio expects file objects with specific structure
    const sourceImageData = {
      path: null as string | null,
      url: null as string | null,
      size: sourceImage.size,
      orig_name: sourceImage.name,
      mime_type: sourceImage.type || "image/png",
      is_stream: false,
      meta: { _type: "update" },
    }

    const targetImageData = {
      path: null as string | null,
      url: null as string | null,
      size: targetImage.size,
      orig_name: targetImage.name,
      mime_type: targetImage.type || "image/png",
      is_stream: false,
      meta: { _type: "update" },
    }

    const client = await Client.connect("serotoninboi/ComfyUI")
    const result = await client.predict("/generate_image", {
      source_image: handle_file(sourceImage),
      target_image: handle_file(targetImage),
      target_index: Number.parseInt(targetIndex),
      swap_model: swapModel,
      face_restore_model: faceRestoreModel,
      restore_strength: restoreStrength,
    })

    console.log("[face-swap] API response received", { result })

    if (!result.data || !result.data[0]) {
      throw new Error("No image generated from face-swap API")
    }

    const generatedImage = result.data[0].url
    console.log("[face-swap] Face swap successful:", { generatedImage })

    return NextResponse.json({ result: generatedImage })
  } catch (err) {
    console.error("[face-swap] Unexpected error:", err)
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { message: `Failed to swap faces: ${errorMessage}` },
      { status: 500 }
    )
  }
}
