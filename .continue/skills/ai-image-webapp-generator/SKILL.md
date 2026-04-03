# AI Image WebApp Generator Skill

## Overview
This skill generates complete AI image processing web applications with modern UI, API routes, and AI model integration.

## When to Use
- Building AI-powered image generation apps
- Creating face swap, image editing, or pose estimation applications
- Integrating HuggingFace or Gradio models into Next.js

## Capabilities
- Complete Next.js 14 App Router setup
- Clerk authentication integration
- HuggingFace Inference API integration
- Gradio client integration
- Credit-based usage system
- Modern UI with Tailwind + Framer Motion

## Instructions

### Project Structure
```
app/
  api/
    face-swap/route.ts     - Face swap endpoint
    image-edit/route.ts    - Image editing endpoint
    pose-edit/route.ts     - Pose estimation endpoint
    billing/route.ts       - Payment handling
  studio/
    face-swap/page.tsx     - Face swap UI
    image-edit/page.tsx    - Image edit UI
    pose-edit/page.tsx     - Pose edit UI
  pricing/page.tsx         - Pricing page
  account/page.tsx         - User account
components/
  ui/                      - shadcn/ui components
  features/                - Feature-specific components
lib/
  hf.ts                    - HuggingFace client utilities
  auth.ts                  - JWT auth utilities
  credits.ts               - Credit management
  db.ts                    - Database utilities
hooks/
  use-credits.ts           - Credits hook
  use-toast.ts             - Toast notifications
  use-mobile.ts            - Mobile detection
```

### API Design

#### Face Swap Endpoint
```typescript
POST /api/face-swap
- Auth: Clerk userId required
- Body: FormData with sourceImage, targetImage, targetIndex, swapModel
- Returns: { result: imageUrl }
```

#### Image Edit Endpoint
```typescript
POST /api/image-edit
- Auth: Clerk userId required
- Body: FormData with image, prompt, strength, guidanceScale
- Returns: { result: base64DataUrl, seed }
```

#### Pose Edit Endpoint
```typescript
POST /api/pose-edit
- Auth: Clerk userId required
- Body: FormData with personImage, poseImage
- Returns: { result: imageUrl }
```

### Credit System
- Each generation costs 1 credit
- Credits stored in database (JSON or SQL)
- Check credits before generation
- Deduct after successful generation
- Log all generations for audit

### UI Components
- GeneratorHeader: Title, description, icon
- ImageInput: Drag-drop with preview
- GeneratorSettings: Seed, steps, guidance scale
- ResultCard: Display generated image
- CreditsDisplay: Show current credits

### Error Handling
- Return appropriate HTTP status codes
- Include retryable flag for model loading errors
- Log errors server-side
- Show user-friendly messages

### Security
- Always verify Clerk auth on API routes
- Validate file types (image/* only)
- Limit file sizes (max 10MB recommended)
- Sanitize user inputs
"