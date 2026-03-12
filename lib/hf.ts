/**
 * Shared HuggingFace Inference API client
 * Handles cold-start 503s with automatic retry + exponential backoff
 */

const HF_API = 'https://router.huggingface.co'

export function getHFToken(): string {
  const token = process.env.HUGGINGFACE_TOKEN
  if (!token || token === 'hf_your_token_here') {
    throw new HFConfigError('Hugging Face token not configured. Add HUGGINGFACE_TOKEN to .env.local')
  }
  return token
}

export class HFConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HFConfigError'
  }
}

export class HFModelError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'HFModelError'
    this.status = status
  }
}

interface HFRequestOptions {
  model: string
  body: Record<string, unknown>
  token: string
  /** Max retries on 503 model-loading responses. Default: 3 */
  maxRetries?: number
  /** Timeout per attempt in ms. Default: 120_000 */
  timeoutMs?: number
}

/**
 * POST to HF Inference API with retry on cold-start 503s.
 * Returns raw Response for caller to parse (JSON or binary).
 */
export async function hfInference({
  model,
  body,
  token,
  maxRetries = 3,
  timeoutMs = 120_000,
}: HFRequestOptions): Promise<Response> {
  const url = `${HF_API}/models/${model}`

  let lastError: Error = new Error('Unknown error')

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-wait-for-model': 'true', // ask HF to wait instead of 503 on cold start
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      })

      // Model still loading — wait and retry
      if (res.status === 503) {
        const waitSeconds = Math.pow(2, attempt + 1) // 2s, 4s, 8s
        console.warn(`[HF] Model loading (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${waitSeconds}s…`)
        await sleep(waitSeconds * 1000)
        lastError = new HFModelError('Model is loading', 503)
        continue
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new HFModelError(
          `HuggingFace API error ${res.status}: ${text.slice(0, 200)}`,
          res.status
        )
      }

      return res
    } catch (err) {
      if (err instanceof HFModelError) throw err // non-503 errors bubble immediately
      lastError = err as Error
      if (attempt < maxRetries) {
        await sleep(1000 * (attempt + 1))
      }
    }
  }

  throw lastError
}

/**
 * POST to a Gradio Space endpoint (used for AnyPose).
 * Gradio spaces use /run/predict and return JSON { data: [...] }
 */
interface GradioRequestOptions {
  spaceUrl: string
  data: unknown[]
  token: string
  maxRetries?: number
  timeoutMs?: number
}

export async function gradioPredict({
  spaceUrl,
  data,
  token,
  maxRetries = 3,
  timeoutMs = 120_000,
}: GradioRequestOptions): Promise<unknown[]> {
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${spaceUrl}/run/predict`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (res.status === 503) {
        const wait = Math.pow(2, attempt + 1)
        console.warn(`[Gradio] Space loading (attempt ${attempt + 1}), retrying in ${wait}s…`)
        await sleep(wait * 1000)
        lastError = new HFModelError('Space is loading', 503)
        continue
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new HFModelError(`Gradio space error ${res.status}: ${text.slice(0, 200)}`, res.status)
      }

      const json = await res.json()
      if (!Array.isArray(json?.data)) {
        throw new Error('Unexpected Gradio response shape: missing data array')
      }
      return json.data as unknown[]
    } catch (err) {
      if (err instanceof HFModelError) throw err
      lastError = err as Error
      if (attempt < maxRetries) await sleep(1000 * (attempt + 1))
    }
  }

  throw lastError
}

/** Convert a File/Blob to base64 data URL */
export async function fileToDataUrl(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  return `data:${file.type};base64,${base64}`
}

/** Convert raw ArrayBuffer response to base64 data URL */
export function bufferToDataUrl(buf: ArrayBuffer, mime: string): string {
  const base64 = Buffer.from(buf).toString('base64')
  return `data:${mime};base64,${base64}`
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
