"# AI Content API Reference

## HuggingFace Inference API

### Image-to-Image Generation

**Endpoint:** `POST /models/{model}/`

**Headers:**
```
Authorization: Bearer {HF_TOKEN}
Content-Type: application/json
x-wait-for-model: true
```

**Request Body:**
```json
{
  \"inputs\": \"<base64_image_or_url>\",
  \"parameters\": {
    \"prompt\": \"description of desired output\",
    \"strength\": 0.75,
    \"guidance_scale\": 7.5,
    \"num_inference_steps\": 50,
    \"seed\": 42
  }
}
```

**Response:** Binary image data

### Using @huggingface/inference Package

```typescript
import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(process.env.HF_TOKEN!);

// Image-to-Image
const resultBlob = await client.imageToImage({
  model: 'lightx2v/Qwen-Image-Edit-2511-Lightning',
  inputs: imageBlob,
  parameters: {
    prompt: 'artistic transformation',
    strength: 0.8,
    guidance_scale: 7.5,
    num_inference_steps: 50,
  },
});
```

### Available Models

| Model ID | Use Case | Strength Range |
|----------|----------|---------------|
| `lightx2v/Qwen-Image-Edit-2511-Lightning` | Instruction-based editing | 0.5-1.0 |
| `timbrooks/instruct-pix2pix` | Natural language editing | 0.7-0.9 |
| `stabilityai/stable-diffusion-xl-refiner-1.0` | High-quality refinement | 0.3-0.7 |

## Gradio Client API

### Installation
```bash
npm install @gradio/client
```

### Connecting to a Space
```typescript
import { Client, handle_file } from '@gradio/client';

const client = await Client.connect('username/space-name');
```

### Face Swap Example
```typescript
const result = await client.predict('/generate_image', {
  source_image: handle_file(sourceImageFile),
  target_image: handle_file(targetImageFile),
  target_index: 0,
  swap_model: 'hyperswap_1b_256.onnx',
  face_restore_model: 'none',
  restore_strength: 0.7,
});

// Result structure
console.log(result.data); // Array of output values
console.log(result.data[0].url); // Generated image URL
```

### handle_file Utility
```typescript
import { handle_file } from '@gradio/client';

// Convert File/Blob to Gradio-compatible format
const fileData = handle_file(imageFile);
// or with explicit options
const fileData = handle_file(imageBlob, {
  mime_type: 'image/png',
});
```

### Common Gradio Patterns

**Poll for Status:**
```typescript
const status = await client.view_api();
console.log(status);
```

**Stream Results:**
```typescript
for await (const batch of client.submit('/predict', data)) {
  console.log(batch);
}
```

## Common Models by Task

### Face Swap
| Model | Speed | Quality | Notes |
|-------|-------|---------|-------|
| `inswapper_128.onnx` | Fast | Good | 128px input |
| `hyperswap_1b_256.onnx` | Medium | High | 256px input |

### Face Restoration
| Model | Resolution | Use Case |
|-------|------------|----------|
| `GPEN-BFR-512.onnx` | 512px | High-quality restoration |

### Image Editing
| Model | Control | Best For |
|-------|---------|----------|
| `Qwen-Image-Edit-2511-Lightning` | Prompt-based | Natural language editing |
| `InstructPix2Pix` | Prompt-based | Style transfer |
| `SDXL-Refiner` | Strength-based | Quality enhancement |

### Pose Estimation
| Space | Description |
|-------|-------------|
| `hysts/anypose` | Universal pose transfer |
| `Tencent/HunyuanPhoto2Pose` | Portrait pose editing |

## Error Handling

### HuggingFace Errors

| Status | Meaning | Action |
|--------|---------|--------|
| 503 | Model loading | Retry with backoff |
| 429 | Rate limited | Wait and retry |
| 400 | Bad request | Check parameters |

### Gradio Errors

```typescript
try {
  const result = await client.predict('/endpoint', data);
} catch (err) {
  if (err.message.includes('loading')) {
    // Space is cold starting
    await sleep(5000);
    // Retry
  }
}
```

## Best Practices

1. **Set x-wait-for-model header** to avoid 503 errors from cold starts
2. **Use appropriate timeout** (120s recommended for complex models)
3. **Implement retry logic** with exponential backoff
4. **Cache model connections** when possible
5. **Validate input images** before sending to API
6. **Convert outputs to data URLs** for immediate frontend display
7. **Log seed values** for reproducibility
"