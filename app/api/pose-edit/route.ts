import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { InferenceClient } from "@huggingface/inference"

// ─── Config ────────────────────────────────────────────────────────────────
// timbrooks/instruct-pix2pix — instruction-based img2img, no safety filter
// Swap via env for other uncensored models, e.g.:
//   "stabilityai/stable-diffusion-xl-refiner-1.0"  (strength-based img2img)
//   "lllyasviel/sd-controlnet-canny"                (structure-preserving)
const MODEL_ID =
  process.env.HF_IMG2IMG_MODEL ?? "lilylilith/AnyPose"

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
    const subjectImage = formData.get("referenceImage") as File | null
    const poseImage = formData.get("poseImage") as File | null
    const prompt = (formData.get("prompt") as string)?.trim()

    if (!subjectImage) {
      return NextResponse.json(
        { message: "reference image is required" },
        { status: 400 }
      )
    }
    if (!poseImage) {
      return NextResponse.json(
        { message: "pose image is required" },
        { status: 400 }
      )
    }
    // if (!prompt) {
    //   return NextResponse.json(
    //     { message: "prompt is required" },
    //     { status: 400 }
    //   )
    // }

    // ── Optional params ─────────────────────────────────────────────────────
    // `strength` (0–1): how much to deviate from the source image.
    //   0.0 = identical to input, 1.0 = ignore input completely.
    //   instruct-pix2pix typically works best at 0.7–0.9.
    // ── Inference parameters ───────────────────────────────────────────────
    const guidanceScale = parseFloat(
      (formData.get("guidanceScale") as string) ?? "7.5"
    )
    const numInferenceSteps = parseInt(
      (formData.get("numSteps") as string) ?? "50"
    )
    const negativePrompt =
      (formData.get("negativePrompt") as string)?.trim() || undefined
    const seed = formData.get("seed")
      ? parseInt(formData.get("seed") as string)
      : Math.floor(Math.random() * 2 ** 32)

    console.log("[pose-edit] Starting pose transfer inference", {
      model: MODEL_ID,
      guidanceScale,
      numInferenceSteps,
      seed,
    })

    // ── Convert images to base64 ────────────────────────────────────────────
    const imageToBase64 = async (file: File): Promise<string> => {
      const buffer = await file.arrayBuffer()
      return Buffer.from(buffer).toString("base64")
    }

    const refBase64 = await imageToBase64(subjectImage)
    const poseBase64 = await imageToBase64(poseImage)

    // ── Call Qwen-Image-Edit via raw API (more control over multiple images) ─
    // AnyPose expects: image 1 (character) + image 2 (pose reference) + prompt
    const apiUrl = `https://router.huggingface.co/models/${MODEL_ID}`
    
    const posePrompt = prompt || 
      "Make the person in image 1 do the exact same pose of the person in image 2. " +
      "The new pose should be pixel accurate to the pose we are trying to copy. " +
      "The position of the arms and head and legs should be the same as the pose we are trying to copy. " +
      "Change the field of view and angle to match exactly image 2."

    const client = new InferenceClient(HF_TOKEN)
      
      const resultBlob = await client.imageToImage({
        model: MODEL_ID,
  inputs: poseImage,
        parameters: {
          prompt: posePrompt,
          negative_prompt: negativePrompt,
          guidance_scale: guidanceScale,
          // instruct-pix2pix specific — ignored by other models
          num_inference_steps: numInferenceSteps,
          seed,
        },
      })

    // Convert blob → base64 data URL for immediate frontend consumption
    const arrayBuffer = await resultBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = resultBlob.type || "image/png"
    const dataUrl = `data:${mimeType};base64,${base64}`

    console.log("[pose-edit] Inference successful", {
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
    console.error("[pose-edit] Inference error:", err)

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
