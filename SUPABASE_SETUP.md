# Supabase Integration Setup

This guide walks you through setting up Supabase for your Claudine AI image-to-image webapp.

## Prerequisites

- Supabase account (https://supabase.com)
- A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Set Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Run Database Migration

1. Go to your Supabase project dashboard
2. Click "SQL Editor" → "New Query"
3. Copy the entire content from `supabase-migration.sql`
4. Paste it into the SQL editor
5. Click "Run"

This will create:
- `users` table (synced with Supabase Auth)
- `billing` table (payment records)
- `credit_transactions` table (audit trail)
- `generations` table (image generation history)
- Automatic triggers for credit management

## Step 4: Enable Email Confirmation (Optional)

1. Go to Authentication → Providers → Email
2. Toggle "Confirm email" to enable email verification
3. Configure email templates if needed

## Step 5: Configure CORS (if needed)

If you're running locally on `http://localhost:3000`:

1. Go to Authentication → URL Configuration
2. Add `http://localhost:3000` to "Redirect URLs"

## API Endpoints

Your app now has these new endpoints:

### User Management
- `GET /api/user/profile` - Get user profile and credits
- `PATCH /api/user/profile` - Update user profile

### Billing
- `POST /api/billing/purchase-credits` - Create a credit purchase
- `POST /api/billing/complete-payment` - Mark payment as completed

### Generations
- `POST /api/generations/create` - Record a new generation (auto-deducts credits)

## How Credits Work

1. **Purchase Credits**: User initiates purchase → creates billing record
2. **Complete Payment**: Payment provider confirms → credits added to user
3. **Use Credits**: User generates image → credits automatically deducted
4. **Audit Trail**: All transactions logged in `credit_transactions` table

## Authentication Flow

The app now uses Supabase Auth instead of custom JWT:

1. User signs up/logs in
2. Supabase Auth creates session
3. AuthContext automatically syncs user profile
4. All API routes check Supabase session
5. User data synced from `users` table

## Troubleshooting

### "Unauthorized" errors
- Check that Supabase session is valid
- Verify environment variables are set correctly
- Check browser cookies for `sb-auth-token`

### Credits not deducting
- Ensure database triggers are created (run migration again)
- Check `credit_transactions` table for logs
- Verify user has sufficient credits before generation

### User not syncing
- Check that `users` table has correct RLS policies
- Verify auth trigger is working (check `on_auth_user_created`)
- Check browser console for errors

## Next Steps

1. **Integrate Payment Provider**: Connect Stripe, Segpay, or Epoch
2. **Add Credit Packages**: Define pricing tiers
3. **Implement Subscription**: Add recurring billing
4. **Add Analytics**: Track usage patterns

## Support

For issues, check:
- Supabase Docs: https://supabase.com/docs
- Your project logs: Supabase Dashboard → Logs
- Browser console for client-side errors
