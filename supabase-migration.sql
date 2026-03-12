-- Create users table (synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  credits INT DEFAULT 10,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'premium'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create billing table for tracking payments
CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  credits_added INT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed'
  provider TEXT NOT NULL, -- 'segpay', 'epoch', 'stripe', etc.
  provider_ref TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create credit transactions table for audit trail
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL, -- positive for add, negative for deduct
  reason TEXT NOT NULL, -- 'purchase', 'generation', 'refund', etc.
  related_id UUID, -- reference to billing or generation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create generation history table
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT,
  input_url TEXT,
  output_url TEXT,
  model_used TEXT,
  credits_used INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for billing table
CREATE POLICY "Users can view their own billing" ON billing
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for credit_transactions table
CREATE POLICY "Users can view their own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for generations table
CREATE POLICY "Users can view their own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update user's updated_at
CREATE OR REPLACE FUNCTION update_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_user_updated_at();

-- Create function to deduct credits when generation is created
CREATE OR REPLACE FUNCTION deduct_generation_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Deduct credits from user
  UPDATE users SET credits = credits - NEW.credits_used WHERE id = NEW.user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (user_id, amount, reason, related_id)
  VALUES (NEW.user_id, -NEW.credits_used, 'generation', NEW.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger for credit deduction
DROP TRIGGER IF EXISTS on_generation_created ON generations;
CREATE TRIGGER on_generation_created
  AFTER INSERT ON generations
  FOR EACH ROW EXECUTE FUNCTION deduct_generation_credits();

-- Create function to add credits when billing is completed
CREATE OR REPLACE FUNCTION add_billing_credits()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Add credits to user
    UPDATE users SET credits = credits + NEW.credits_added WHERE id = NEW.user_id;
    
    -- Log transaction
    INSERT INTO credit_transactions (user_id, amount, reason, related_id)
    VALUES (NEW.user_id, NEW.credits_added, 'purchase', NEW.id);
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger for credit addition
DROP TRIGGER IF EXISTS on_billing_completed ON billing;
CREATE TRIGGER on_billing_completed
  BEFORE UPDATE ON billing
  FOR EACH ROW EXECUTE FUNCTION add_billing_credits();

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_billing_user_id ON billing(user_id);
CREATE INDEX idx_billing_provider_ref ON billing(provider_ref);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_generations_user_id ON generations(user_id);
