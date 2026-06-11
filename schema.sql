-- ============================================================
-- LEXI PM — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Brief items table — stores every classified item from Slack, Gmail, ClickUp, Drive
create table if not exists brief_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  source text not null check (source in ('slack', 'gmail', 'clickup', 'drive')),
  channel text,
  thread_id text,
  sender text,
  raw_content text not null,
  summary text,
  why_it_matters text,
  owner text,
  recommended_action text,
  classification text check (classification in (
    'Urgent', 'Decision Needed', 'Client Risk', 'Delivery Risk',
    'Engineering Blocker', 'Follow-up Required', 'Waiting On Others',
    'Commercial Opportunity', 'FYI', 'Ignore'
  )),
  risk_level text check (risk_level in ('Low', 'Medium', 'High')),
  confidence text check (confidence in ('Low', 'Medium', 'High')),
  status text default 'open' check (status in ('open', 'closed', 'snoozed')),
  vijith_mentioned boolean default false,
  draft_response text,
  draft_approved boolean default false,
  draft_sent boolean default false
);

-- Tasks table — open tasks addressed to Vijith by name
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  source text not null check (source in ('slack', 'gmail', 'clickup', 'drive')),
  description text not null,
  addressed_by text,
  channel text,
  thread_id text,
  status text default 'open' check (status in ('open', 'closed', 'snoozed')),
  context text
);

-- Threads table — active threads Vijith is named in
create table if not exists threads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  source text not null,
  channel text,
  thread_id text unique,
  title text,
  summary text,
  last_activity timestamptz default now(),
  participants text[],
  vijith_named boolean default false,
  action_required boolean default false
);

-- Enable Row Level Security
alter table brief_items enable row level security;
alter table tasks enable row level security;
alter table threads enable row level security;

-- Allow all operations via anon key (your app uses the anon key)
create policy "Allow all for anon" on brief_items for all using (true) with check (true);
create policy "Allow all for anon" on tasks for all using (true) with check (true);
create policy "Allow all for anon" on threads for all using (true) with check (true);

-- Indexes for performance
create index if not exists brief_items_status_idx on brief_items(status);
create index if not exists brief_items_classification_idx on brief_items(classification);
create index if not exists brief_items_created_at_idx on brief_items(created_at desc);
create index if not exists brief_items_vijith_idx on brief_items(vijith_mentioned);
create index if not exists tasks_status_idx on tasks(status);
create index if not exists tasks_created_at_idx on tasks(created_at desc);
