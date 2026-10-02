-- Run this once in the Supabase project's SQL editor (Dashboard → SQL Editor → New query).
-- Tracks each user's subscription status, written only by the Stripe webhook
-- (via the service role key, which bypasses Row Level Security below).

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'none',
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- Users may read their own subscription row (used by the dashboard).
-- No insert/update/delete policy is defined for regular users — only the
-- service role key (used server-side in /api/stripe-webhook.js) can write.
create policy "Users can read their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);
