"# Design Patterns for AI Image WebApps

## 1. API Pattern with Retry Logic

### HuggingFace Inference with Backoff
```typescript
async function hfInferenceWithRetry(options) {
  const { model, body, token, maxRetries = 3, timeoutMs = 120000 } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
      
      // Model still loading - retry with backoff
      if (res.status === 503) {
        const waitMs = Math.pow(2, attempt + 1) * 1000;
        await sleep(waitMs);
        continue;
      }
      
      return res;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await sleep(1000 * (attempt + 1));
    }
  }
}
```

### Gradio Space Integration
```typescript
import { Client } from '@gradio/client';

async function callGradioSpace(spaceUrl, endpoint, data) {
  const client = await Client.connect(spaceUrl);
  const result = await client.predict(endpoint, data);
  return result.data;
}
```

## 2. Credit System Pattern

### Atomic Credit Operations
```typescript
async function deductCredits(userId: string, amount: number) {
  const db = await readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  if (db.users[userIndex].credits < amount) {
    return { success: false, error: 'Insufficient credits' };
  }
  
  db.users[userIndex].credits -= amount;
  await writeDB(db);
  
  return { success: true, remaining: db.users[userIndex].credits };
}
```

### Generation Logging
```typescript
async function logGeneration(userId, generationData) {
  const generation = {
    id: generateId(),
    userId,
    createdAt: new Date().toISOString(),
    ...generationData,
  };
  
  db.generations.push(generation);
  await writeDB(db);
  
  return generation;
}
```

## 3. File Upload Pattern

### FormData with Image Validation
```typescript
export async function handleImageUpload(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image') as File | null;
  
  if (!image) {
    return NextResponse.json({ error: 'Image required' }, { status: 400 });
  }
  
  if (!image.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  
  if (image.size > 10 * 1024 * 1024) { // 10MB
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }
  
  return image;
}
```

## 4. Clerk Integration Pattern

### Server-Side Auth Check
```typescript
import { auth } from '@clerk/nextjs/server';

export async function APIRoute(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Proceed with authenticated request
}
```

### Webhook User Sync
```typescript
export async function POST(req: NextRequest) {
  const { type, data } = await req.json();
  
  switch (type) {
    case 'user.created':
    case 'user.updated':
      await upsertUser(data.id, data.email, data.name);
      break;
    case 'user.deleted':
      await deleteUser(data.id);
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

## 5. UI State Management

### Generation State Machine
```typescript
type GenerationState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: string }
  | { status: 'error'; message: string };

// Use Zustand for client state
const useGenerationStore = create<{
  state: GenerationState;
  submit: (image: File, options: Options) => Promise<void>;
  reset: () => void;
}>((set) => ({
  state: { status: 'idle' },
  submit: async (image, options) => {
    set({ state: { status: 'loading' } });
    try {
      const result = await generateImage(image, options);
      set({ state: { status: 'success', result } });
    } catch (err) {
      set({ state: { status: 'error', message: err.message } });
    }
  },
  reset: () => set({ state: { status: 'idle' } }),
}));
```

## 6. Performance Patterns

### Image to Base64 Conversion
```typescript
async function blobToDataUrl(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = blob.type || 'image/png';
  return `data:${mimeType};base64,${base64}`;
}
```

### Connection Reuse
```typescript
// Reuse client instance
let hfClient: InferenceClient | null = null;

function getHFClient(token: string): InferenceClient {
  if (!hfClient) {
    hfClient = new InferenceClient(token);
  }
  return hfClient;
}
```

## 7. Error Response Pattern

### Structured Error Responses
```typescript
return NextResponse.json({
  error: 'Human readable message',
  code: 'ERROR_CODE', // For programmatic handling
  retryable: true,    // If user should retry
}, { status: 500 });
```

### Retry Information
```typescript
const isModelLoading = errorMessage.toLowerCase().includes('loading');

return NextResponse.json({
  message: isModelLoading
    ? 'Model is loading, please retry in ~20 seconds'
    : `Generation failed: ${errorMessage}`,
  retryable: isModelLoading,
}, { status: isModelLoading ? 503 : 500 });
```
"