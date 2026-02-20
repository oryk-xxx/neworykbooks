create schema if not exists public;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_payment_id text
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  summary text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  average_rating numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id) on delete cascade,
  order_index integer not null,
  slug text not null,
  content jsonb not null,
  estimated_read_time_minutes integer not null default 5,
  created_at timestamptz not null default now(),
  unique (book_id, order_index),
  unique (book_id, slug)
);

create table if not exists public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  content jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  page_id uuid not null references public.pages (id) on delete cascade,
  unlocked boolean not null default false,
  attempts integer not null default 0,
  score numeric,
  last_attempt_at timestamptz,
  total_read_time_seconds integer not null default 0,
  primary key (user_id, page_id)
);

create table if not exists public.follows (
  follower_id uuid not null references auth.users (id) on delete cascade,
  following_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.books enable row level security;
alter table public.pages enable row level security;
alter table public.page_versions enable row level security;
alter table public.progress enable row level security;
alter table public.follows enable row level security;
alter table public.ratings enable row level security;
alter table public.results enable row level security;
alter table public.logs enable row level security;

create policy "Public read profiles" on public.profiles
  for select
  using (true);

create policy "Users manage own profile" on public.profiles
  for all
  using (auth.uid() = id);

create policy "Users read own entitlement" on public.entitlements
  for select
  using (auth.uid() = user_id);

create policy "Service updates entitlements" on public.entitlements
  for insert
  with check (auth.role() = 'service_role');

create policy "Service updates entitlements update" on public.entitlements
  for update
  using (auth.role() = 'service_role');

create policy "Admins manage books" on public.books
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

create policy "Users see published books when entitled" on public.books
  for select
  using (
    status = 'published'
    and exists (
      select 1
      from public.entitlements e
      where e.user_id = auth.uid()
      and e.active = true
    )
  );

create policy "Admins manage pages" on public.pages
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

create policy "Users read pages when entitled" on public.pages
  for select
  using (
    exists (
      select 1
      from public.entitlements e
      where e.user_id = auth.uid()
      and e.active = true
    )
  );

create policy "Admins manage page versions" on public.page_versions
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

create policy "Users manage own progress" on public.progress
  for all
  using (auth.uid() = user_id);

create policy "Users manage own follows" on public.follows
  for all
  using (auth.uid() = follower_id);

create policy "Users manage own ratings" on public.ratings
  for all
  using (auth.uid() = user_id);

create policy "Users manage own results" on public.results
  for all
  using (auth.uid() = user_id);

create policy "Users insert logs" on public.logs
  for insert
  with check (true);

create policy "Admins read logs" on public.logs
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

