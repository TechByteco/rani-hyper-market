-- ============================================================
-- NSN SAAS PLATFORM: CREATE MISSING TABLES & ENABLE ACCESS
-- ============================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. TENANTS TABLE (Stores & Enterprises)
create table if not exists public.tenants (
  id uuid default uuid_generate_v4() primary key,
  store_name text not null,
  slug text unique not null,
  owner_email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. STORE ADMINS TABLE (Login Credentials for Store Admins)
create table if not exists public.store_admins (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  username text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. LICENSES TABLE (Subscription & Enterprise Tiers)
create table if not exists public.licenses (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  license_key text unique not null,
  plan_tier text check (plan_tier in ('basic', 'pro', 'enterprise')) default 'pro',
  status text check (status in ('active', 'suspended', 'trial', 'expired')) default 'active',
  max_products integer default 500,
  enable_marketing boolean default true,
  enable_analytics boolean default true,
  expires_at timestamp with time zone default (now() + interval '365 days') not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Link existing products & orders to tenant if needed
alter table public.products add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.orders add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;

-- 6. GRANT FULL PERMISSIONS TO API ROLES
grant all on table public.tenants to anon, authenticated, service_role;
grant all on table public.store_admins to anon, authenticated, service_role;
grant all on table public.licenses to anon, authenticated, service_role;

-- 7. ENABLE ROW LEVEL SECURITY WITH PUBLIC ACCESS
alter table public.tenants enable row level security;
alter table public.store_admins enable row level security;
alter table public.licenses enable row level security;

-- Drop old policies if any to avoid errors
drop policy if exists "Allow all on tenants" on public.tenants;
drop policy if exists "Allow all on store_admins" on public.store_admins;
drop policy if exists "Allow all on licenses" on public.licenses;

-- Create open policies for SaaS operations
create policy "Allow all on tenants" on public.tenants for all using (true) with check (true);
create policy "Allow all on store_admins" on public.store_admins for all using (true) with check (true);
create policy "Allow all on licenses" on public.licenses for all using (true) with check (true);

-- 8. INSERT INITIAL SEED STORE & ADMIN
insert into public.tenants (id, store_name, slug, owner_email)
values ('11111111-1111-1111-1111-111111111111', 'NSN Market Main Store', 'nsn-market-main', 'admin')
on conflict (id) do update set store_name = excluded.store_name;

insert into public.store_admins (tenant_id, username, password_hash)
values ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@123')
on conflict (username) do update set password_hash = excluded.password_hash;

insert into public.licenses (tenant_id, license_key, plan_tier, status, max_products, expires_at)
values ('11111111-1111-1111-1111-111111111111', 'NSN-PRO-2026-KEY', 'enterprise', 'active', 9999, now() + interval '365 days')
on conflict (license_key) do update set status = 'active';

-- Refresh PostgREST schema cache
notify pgrst, 'reload schema';
