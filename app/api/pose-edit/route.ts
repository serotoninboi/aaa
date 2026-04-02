import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { Client } from "@gradio/client"

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const referenceImage = formData.get("referenceImage") as File | null
    const poseImage = formData.get("poseImage") as File | null
    const prompt = (formData.get("prompt") as string) ?? ""
    const seed = parseInt((formData.get("seed") as string) ?? "0")
    const randomizeSeed = formData.get("randomizeSeed") !== "false"
    const guidanceScale = parseFloat((formData.get("guidanceScale") as string) ?? "1")
    const numSteps = parseInt((formData.get("numSteps") as string) ?? "4")
    const height = parseInt((formData.get("height") as string) ?? "256")
    const width = parseInt((formData.get("width") as string) ?? "256")
    const rewritePrompt = formData.get("rewritePrompt") === "true"

    if (!referenceImage || !poseImage) {
      return NextResponse.json(
        { message: "Reference and pose images are required" },
        { status: 400 }
      )
    }

    console.log("[pose-edit] Processing request", {
      referenceImage: referenceImage.name,
      poseImage: poseImage.name,
      seed,
      guidanceScale,
      numSteps,
      height,
      width,
    })

    const referenceBlob = new Blob([await referenceImage.arrayBuffer()], {
      type: referenceImage.type || "image/png",
    })
    const poseBlob = new Blob([await poseImage.arrayBuffer()], {
      type: poseImage.type || "image/png",
    })

    const defaultPrompt = `Make the person in image 1 do the exact same pose of the person in image 2. 
Changing the style and background of the image of the person in image 1 is undesirable, so don't do it. 
The new pose should be pixel accurate to the pose we are trying to copy. 
The position of the arms and head and legs should be the same as the pose we are trying to copy. 
Change the field of view and angle to match exactly image 2. Head tilt and eye gaze pose should match the person in image 2. 
Remove the background of image 2, and replace it with the background of image 1.
Don't change the identity of the person in image 1, keep their appearance the same, it is undesirable to change their facical features or hair style. don't do it.`

    const client = await Client.connect("serotoninboi/Qwen-Image-Edit-2511-AnyPose")
    const result = await client.predict("/infer", {
      reference_image: referenceBlob,
      pose_image: poseBlob,
      prompt: prompt.trim() || defaultPrompt,
      seed: randomizeSeed ? Math.floor(Math.random() * 1000000) : seed,
      randomize_seed: randomizeSeed,
      true_guidance_scale: guidanceScale,
      num_inference_steps: numSteps,
      height,
      width,
      rewrite_prompt: rewritePrompt,
    })

    const outputGallery = result.data[0]
    const usedSeed = result.data[1]

    if (!outputGallery || !outputGallery[0]) {
      throw new Error("No image generated from pose-edit API")
    }

    const generatedImage = outputGallery[0].url
    console.log("[pose-edit] Pose edit successful:", { generatedImage, seed: usedSeed })

    return NextResponse.json({ result: generatedImage, seed: usedSeed })
  } catch (err) {
    console.error("[pose-edit] Unexpected error:", err)
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { message: `Failed to edit pose: ${errorMessage}` },
      { status: 500 }
    )
  }
}
