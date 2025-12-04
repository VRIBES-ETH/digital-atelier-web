-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  email text,
  full_name text,
  company_name text,
  role text default 'client' check (role in ('admin', 'client')),
  plan_tier text default 'seed' check (plan_tier in ('seed', 'growth', 'authority')),
  linkedin_picture_url text,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'client');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  client_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  reference_link text,
  status text default 'draft' check (status in ('draft', 'pending_approval', 'approved', 'scheduled', 'published', 'changes_requested')),
  scheduled_for timestamp with time zone,
  linkedin_post_id text,
  published_at timestamp with time zone,
  feedback text,
  author_role text default 'admin' check (author_role in ('admin', 'client'))
);

-- Enable RLS for posts
alter table posts enable row level security;

-- Policies for posts
create policy "Clients can view their own posts." on posts
  for select using ((select auth.uid()) = client_id);

create policy "Clients can insert their own posts." on posts
  for insert with check ((select auth.uid()) = client_id);

create policy "Clients can update their own posts." on posts
  for update using ((select auth.uid()) = client_id);


-- Add metrics columns to posts table
ALTER TABLE posts ADD COLUMN likes_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN comments_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN shares_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN metrics_updated_at TIMESTAMP WITH TIME ZONE;
