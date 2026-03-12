# PixelForge — AI Image Studio

**Next.js 14 App Router · Radix UI + Tailwind · JWT Auth · Hugging Face AI**

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI Components | Radix UI primitives + custom CVA variants |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Auth | Supabase Auth via `@supabase/ssr` (cookie + RLS) |
| AI | Hugging Face Inference API |
| Data store | Supabase Postgres (schema in `supabase-migration.sql`, RLS + triggers) |

---

## Quick start

### 1. Install

```bash
pnpm install
```

### 2. Configure

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
HUGGINGFACE_TOKEN=hf_your_token_here
```

See `SUPABASE_SETUP.md` for the Supabase migration script, auth redirect URLs, and credit flow triggers.

Get a free HF token at https://huggingface.co/settings/tokens

### 3. Run

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve production build
```

---

## Project layout

```
app/
  api/
    auth/
      register/route.ts   POST /api/auth/register
      login/route.ts      POST /api/auth/login
      me/route.ts         GET  /api/auth/me
    image-edit/route.ts   POST /api/image-edit
    pose-edit/route.ts    POST /api/pose-edit
  (auth)/                 Login + Register pages
  (studio)/               Protected Image/Pose edit pages
  layout.tsx
  globals.css

components/
  ui/                     button, input, textarea, card, badge, alert
  AuthContext.tsx         Client-side auth state
  Header.tsx
  DropZone.tsx
  ResultPanel.tsx

lib/
  auth.ts                 JWT + bcrypt helpers
  userStore.ts            In-memory user store (replace with DB)
  utils.ts                cn() helper
```

---

## API Reference

### Auth

**POST** `/api/auth/register`
```json
{ "name": "Jane", "email": "jane@example.com", "password": "secret123" }
```

**POST** `/api/auth/login`
```json
{ "email": "jane@example.com", "password": "secret123" }
```

Both return `{ user, token }`.

**GET** `/api/auth/me`  
Header: `Authorization: Bearer <token>`

---

### AI endpoints (require auth header)

**POST** `/api/image-edit`  
Body: `multipart/form-data` — `image` (File) + `prompt` (string)

**POST** `/api/pose-edit`  
Body: `multipart/form-data` — `image` (File) + `pose` (string)

---

## Production upgrade checklist

- [ ] Run `supabase-migration.sql` on your Supabase project and enforce the included RLS/triggers
- [ ] Set a strong `JWT_SECRET` env var
- [ ] Add **rate limiting** (`@upstash/ratelimit` or `express-rate-limit` via custom server)
- [ ] Add file size/type validation middleware
- [ ] Deploy to **Vercel** (zero config for Next.js)

---

## HuggingFace Models

All AI inference runs **remotely via HuggingFace** — no models are downloaded or stored locally.

| Feature | Endpoint | Type |
|---|---|---|
| Image editing | `Qwen/Qwen2-VL-7B-Instruct` | HF Inference API |
| Pose transfer | `linoyts/Qwen-Image-Edit-2511-AnyPose` | Gradio Space |

### How it works

1. The user uploads an image in the browser
2. The Next.js API route receives it server-side
3. The image is base64-encoded and sent to HuggingFace over HTTPS
4. The result is streamed back and returned to the client

### Cold-start handling

Free-tier HF Spaces and Inference API models may be sleeping. The `lib/hf.ts` client automatically retries up to **3 times** with exponential backoff (2s → 4s → 8s) when it receives a 503 "model loading" response. The `x-wait-for-model: true` header is also sent to ask HF to queue the request rather than reject immediately.
