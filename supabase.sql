-- ============================================
-- TURAHOMES REAL ESTATE WEB APP
-- Full Database Schema
-- ============================================
-- Run this in Supabase: SQL Editor > New Query
-- ============================================


-- ============================================
-- 1. TABLES
-- ============================================

-- Users (every signed-up person)
create table users (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  phone text,
  created_at timestamp with time zone default now()
);

-- Agents (people who post listings)
create table agents (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  phone text,
  created_at timestamp with time zone default now()
);

-- Properties (listings)
create table properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  type text check (type in ('house', 'apartment', 'land', 'commercial')) not null,
  status text check (status in ('for sale', 'for rent')) not null,
  bedrooms int default 0,
  bathrooms int default 0,
  area_sqm numeric,
  city text not null,
  location text,
  lat numeric,
  lng numeric,
  images text[] default '{}',
  agent_id uuid references agents(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Inquiries (contact form submissions)
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references properties(id) on delete cascade,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);


-- ============================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================

alter table users enable row level security;
alter table agents enable row level security;
alter table properties enable row level security;
alter table inquiries enable row level security;


-- USERS policies
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);


-- AGENTS policies
create policy "Anyone can view agents"
  on agents for select
  using (true);

create policy "Agents can update own profile"
  on agents for update
  using (auth.uid() = id);


-- PROPERTIES policies
create policy "Anyone can view properties"
  on properties for select
  using (true);

create policy "Agents can insert own properties"
  on properties for insert
  with check (auth.uid() = agent_id);

create policy "Agents can update own properties"
  on properties for update
  using (auth.uid() = agent_id);

create policy "Agents can delete own properties"
  on properties for delete
  using (auth.uid() = agent_id);


-- INQUIRIES policies
create policy "Anyone can submit inquiry"
  on inquiries for insert
  with check (true);

create policy "Agents can view all inquiries"
  on inquiries for select
  using (auth.role() = 'authenticated');


-- ============================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin

  -- Always create a user record
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email
  );

  -- If they signed up as an agent, also create an agent record
  if (new.raw_user_meta_data->>'role' = 'agent') then
    insert into public.agents (id, name, email)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', 'Agent'),
      new.email
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================
-- 4. STORAGE — PROPERTY IMAGES BUCKET
-- ============================================

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true);

create policy "Anyone can view property images"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'property-images'
    and auth.role() = 'authenticated'
  );

create policy "Authenticated users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'property-images'
    and auth.uid() = owner
  );


-- ============================================
-- 5. SEED DATA (optional)
-- ============================================
-- Uncomment and run AFTER creating your first
-- agent account. Replace agent_id with your
-- actual UUID from: Auth > Users in Supabase.
-- ============================================

/*
insert into properties
  (title, description, price, type, status, bedrooms, bathrooms, area_sqm, city, location, lat, lng, images, agent_id)
values
  (
    'Modern 3 Bedroom House',
    'Spacious modern home with garden and parking. Recently renovated with high-end finishes throughout.',
    250000, 'house', 'for sale', 3, 2, 180,
    'Kigali', 'Kimihurura', -1.9441, 30.0619,
    ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    'YOUR-AGENT-UUID-HERE'
  ),
  (
    'Cozy 1 Bedroom Apartment',
    'Perfect starter apartment in the heart of the city. Close to shops, restaurants and public transport.',
    800, 'apartment', 'for rent', 1, 1, 55,
    'Kigali', 'Nyamirambo', -1.9706, 30.0444,
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    'YOUR-AGENT-UUID-HERE'
  ),
  (
    'Commercial Office Space',
    'Prime office space in the CBD. Open plan layout with fiber internet and 24/7 security.',
    3500, 'commercial', 'for rent', 0, 2, 300,
    'Kigali', 'CBD', -1.9500, 30.0588,
    ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    'YOUR-AGENT-UUID-HERE'
  ),
  (
    'Residential Land Plot',
    'Prime land in a quiet residential zone. Ready for construction with all utilities nearby.',
    95000, 'land', 'for sale', 0, 0, 600,
    'Kigali', 'Kicukiro', -1.9800, 30.0700,
    ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    'YOUR-AGENT-UUID-HERE'
  );
*/


-- ============================================
-- DONE!
-- Tables:    users, agents, properties, inquiries
-- Storage:   property-images bucket
-- Trigger:   auto-creates profile on signup
-- ============================================
