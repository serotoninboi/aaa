import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { InferenceClient } from "@huggingface/inference"

// ─── Config ────────────────────────────────────────────────────────────────
// timbrooks/instruct-pix2pix — instruction-based img2img, no safety filter
// Swap via env for other uncensored models, e.g.:
//   "stabilityai/stable-diffusion-xl-refiner-1.0"  (strength-based img2img)
//   "lllyasviel/sd-controlnet-canny"                (structure-preserving)
const MODEL_ID =
  process.env.HF_IMG2IMG_MODEL ?? "lightx2v/Qwen-Image-Edit-2511-Lightning"

const HF_TOKEN = process.env.HF_TOKEN!

// ─── POST /api/hf-img2img ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (!HF_TOKEN) {
    return NextResponse.json(
      { message: "HF_TOKEN environment variable is not set" },
      { status: 500 }
    )
  }

  try {
    const formData = await req.formData()

    // ── Required ────────────────────────────────────────────────────────────
    const image = formData.get("image") as File | null
    const prompt = (formData.get("prompt") as string)?.trim()

    if (!image) {
      return NextResponse.json(
        { message: "image is required" },
        { status: 400 }
      )
    }
    if (!prompt) {
      return NextResponse.json(
        { message: "prompt is required" },
        { status: 400 }
      )
    }

    // ── Optional params ─────────────────────────────────────────────────────
    // `strength` (0–1): how much to deviate from the source image.
    //   0.0 = identical to input, 1.0 = ignore input completely.
    //   instruct-pix2pix typically works best at 0.7–0.9.
    const strength = parseFloat(
      (formData.get("strength") as string) ?? "0.8"
    )
    const guidanceScale = parseFloat(
      (formData.get("guidanceScale") as string) ?? "7.5"
    )
    // instruct-pix2pix uses a second guidance scale for the image conditioning
    const imageGuidanceScale = parseFloat(
      (formData.get("imageGuidanceScale") as string) ?? "1.5"
    )
    const numInferenceSteps = parseInt(
      (formData.get("numSteps") as string) ?? "50"
    )
    const negativePrompt =
      (formData.get("negativePrompt") as string)?.trim() || undefined
    const seed = formData.get("seed")
      ? parseInt(formData.get("seed") as string)
      : Math.floor(Math.random() * 2 ** 32)

    console.log("[hf-img2img] Starting img2img inference", {
      model: MODEL_ID,
      prompt,
      strength,
      guidanceScale,
      imageGuidanceScale,
      numInferenceSteps,
      seed,
      imageType: image.type,
      imageSize: image.size,
    })

    const imageBlob = new Blob([await image.arrayBuffer()], {
      type: image.type || "image/png",
    })

    const client = new InferenceClient(HF_TOKEN)
    
    const resultBlob = await client.imageToImage({
      model: MODEL_ID,
      inputs: imageBlob,
      parameters: {
        prompt,
        negative_prompt: negativePrompt,
        strength,
        guidance_scale: guidanceScale,
        // instruct-pix2pix specific — ignored by other models
        image_guidance_scale: imageGuidanceScale,
        num_inference_steps: numInferenceSteps,
        seed,
      },
    })

    // Convert blob → base64 data URL for immediate frontend consumption
    const arrayBuffer = await resultBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = resultBlob.type || "image/png"
    const dataUrl = `data:${mimeType};base64,${base64}`

    console.log("[hf-img2img] Inference successful", {
      model: MODEL_ID,
      seed,
      outputBytes: arrayBuffer.byteLength,
    })

    return NextResponse.json({
      result: dataUrl,
      seed,
      model: MODEL_ID,
    })
  } catch (err) {
    console.error("[hf-img2img] Inference error:", err)

    // Surface HF API errors clearly (model loading, rate limits, etc.)
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    const isModelLoading = errorMessage.toLowerCase().includes("loading")

    return NextResponse.json(
      {
        message: isModelLoading
          ? "Model is loading, please retry in ~20 seconds"
          : `img2img inference failed: ${errorMessage}`,
        retryable: isModelLoading,
      },
      { status: isModelLoading ? 503 : 500 }
    )
  }
}
