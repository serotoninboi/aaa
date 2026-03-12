# Supabase Integration Guide

This guide shows how to use the new Supabase features in your app.

## Quick Start

### 1. Setup (First Time Only)

```bash
# Install dependencies
pnpm install

# Set environment variables in .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Then run the SQL migration in Supabase dashboard (see SUPABASE_SETUP.md).

### 2. Display User Credits

Add to your header/navbar:

```tsx
import { CreditsDisplay } from '@/components/CreditsDisplay'

export function Header() {
  return (
    <header>
      <CreditsDisplay />
    </header>
  )
}
```

### 3. Add Buy Credits Button

```tsx
import { BuyCreditsDialog } from '@/components/BuyCreditsDialog'

export function Navbar() {
  return (
    <nav>
      <BuyCreditsDialog />
    </nav>
  )
}
```

### 4. Record Image Generation

When user generates an image, record it and deduct credits:

```tsx
import { useCredits } from '@/lib/use-credits'

export function ImageGenerator() {
  const { recordGeneration, credits, isLoading } = useCredits()

  const handleGenerate = async () => {
    if (credits < 1) {
      alert('Not enough credits')
      return
    }

    try {
      // Generate image with your model
      const outputUrl = await generateImage(prompt)

      // Record generation (credits auto-deducted)
      const result = await recordGeneration({
        prompt,
        outputUrl,
        modelUsed: 'your-model-name',
        creditsUsed: 1,
      })

      console.log('Generation recorded, remaining credits:', result.remainingCredits)
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  return (
    <button onClick={handleGenerate} disabled={isLoading || credits < 1}>
      Generate ({credits} credits available)
    </button>
  )
}
```

## API Endpoints

### User Profile

```typescript
// Get user profile
const response = await fetch('/api/user/profile')
const { profile } = await response.json()
console.log(profile.credits, profile.subscription_tier)

// Update profile
const response = await fetch('/api/user/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'New Name' }),
})
```

### Billing

```typescript
// Create credit purchase
const response = await fetch('/api/billing/purchase-credits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    creditsAmount: 150,
    provider: 'stripe',
    providerRef: 'ch_1234567890',
  }),
})
const { billing } = await response.json()

// Complete payment
const response = await fetch('/api/billing/complete-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    billingId: billing.id,
    status: 'completed',
  }),
})
```

### Generations

```typescript
// Record generation
const response = await fetch('/api/generations/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A beautiful sunset',
    inputUrl: 'https://...',
    outputUrl: 'https://...',
    modelUsed: 'stable-diffusion-xl',
    creditsUsed: 1,
  }),
})
const { generation, remainingCredits } = await response.json()
```

## Database Schema

### users table
- `id` - UUID (Supabase Auth user ID)
- `email` - User email
- `name` - User name
- `credits` - Current credit balance
- `subscription_tier` - 'free', 'pro', or 'premium'
- `subscription_status` - 'active', 'cancelled', or 'expired'
- `created_at` - Account creation date
- `updated_at` - Last update date

### billing table
- `id` - UUID
- `user_id` - Reference to users
- `amount` - Payment amount in EUR
- `currency` - Currency code
- `credits_added` - Credits granted
- `status` - 'pending', 'completed', or 'failed'
- `provider` - Payment provider name
- `provider_ref` - Provider transaction ID
- `created_at` - Transaction date

### credit_transactions table
- `id` - UUID
- `user_id` - Reference to users
- `amount` - Credits added/deducted
- `reason` - 'purchase', 'generation', 'refund', etc.
- `related_id` - Reference to billing or generation
- `created_at` - Transaction date

### generations table
- `id` - UUID
- `user_id` - Reference to users
- `prompt` - Generation prompt
- `input_url` - Input image URL
- `output_url` - Generated image URL
- `model_used` - Model name
- `credits_used` - Credits deducted
- `created_at` - Generation date

## Authentication

The app uses Supabase Auth with automatic session management:

```tsx
import { useAuth } from '@/lib/auth-context'

export function MyComponent() {
  const { user, supabaseUser, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please login</div>

  return (
    <div>
      <p>Welcome {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Credits: {user?.credits}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}
```

## Payment Integration

To integrate with a payment provider (Stripe, Segpay, etc.):

1. Set up payment provider account
2. In your payment flow, call `/api/billing/purchase-credits`
3. After payment confirmation, call `/api/billing/complete-payment`
4. Credits are automatically added to user account

Example with Stripe:

```typescript
const handleStripePayment = async (token: string) => {
  // 1. Create purchase record
  const purchaseRes = await fetch('/api/billing/purchase-credits', {
    method: 'POST',
    body: JSON.stringify({
      creditsAmount: 150,
      provider: 'stripe',
    }),
  })
  const { billing } = await purchaseRes.json()

  // 2. Process payment with Stripe
  const stripeRes = await stripe.charges.create({
    amount: 1200, // €12.00
    currency: 'eur',
    source: token,
  })

  // 3. Mark as completed
  await fetch('/api/billing/complete-payment', {
    method: 'POST',
    body: JSON.stringify({
      billingId: billing.id,
      status: 'completed',
    }),
  })
}
```

## Troubleshooting

### Credits not deducting
- Check that generation was recorded successfully
- Verify user has sufficient credits before generation
- Check `credit_transactions` table for logs

### User not authenticated
- Ensure Supabase session cookie is set
- Check browser DevTools → Application → Cookies
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key are correct

### Profile not syncing
- Check that user table has correct data
- Verify RLS policies are not blocking access
- Check browser console for fetch errors

## Next Steps

1. **Connect Payment Provider**: Integrate Stripe/Segpay/Epoch
2. **Add Subscription Plans**: Implement recurring billing
3. **Create Admin Dashboard**: Monitor users and transactions
4. **Add Analytics**: Track usage patterns
5. **Implement Referral System**: Reward user referrals
