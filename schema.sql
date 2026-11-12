create extension if not exists pgcrypto;

-- 1. Table Profiles (Admin)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- Trigger auto create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = '';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Table Store Info
create table if not exists public.store_info (
  id int primary key default 1,
  name text not null default 'Toko UMKM Kami',
  promo_text text not null default '',
  hero_title text not null default 'Koleksi Produk Terbaik Langsung dari Pengrajin',
  hero_description text default 'Temukan pilihan produk lokal berkualitas tinggi dengan harga ramah kantong.',
  whatsapp_number text not null default '6281234567890',
  address text default 'Jl. Raya Utama No. 123, Kota Anda',
  instagram_url text default 'https://instagram.com/',
  about_description text not null default '',
  opening_hours text not null default '',
  advantages text[] not null default '{}',
  map_url text not null default '',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

alter table public.store_info
  add column if not exists promo_text text not null default '',
  add column if not exists about_description text not null default '',
  add column if not exists opening_hours text not null default '',
  add column if not exists advantages text[] not null default '{}',
  add column if not exists map_url text not null default '';

-- Default data toko
insert into public.store_info (id, name, whatsapp_number)
values (1, 'Katalog UMKM Nusantara', '6281234567890')
on conflict (id) do nothing;

-- 3. Table Categories
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

-- 4. Table Products
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(12, 2) not null default 0,
  description text default '',
  image_url text not null,
  image_public_id text not null,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.store_info enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Function check is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer set search_path = '';

-- Policies: Profiles
drop policy if exists "Admins can view profiles" on public.profiles;
create policy "Admins can view profiles" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- Policies: Store Info
drop policy if exists "Public can view store info" on public.store_info;
create policy "Public can view store info" on public.store_info
  for select using (true);
drop policy if exists "Admins can update store info" on public.store_info;
create policy "Admins can update store info" on public.store_info
  for update using (public.is_admin()) with check (public.is_admin());

-- Policies: Categories
drop policy if exists "Public can view categories" on public.categories;
create policy "Public can view categories" on public.categories
  for select using (true);
drop policy if exists "Admins can mutate categories" on public.categories;
create policy "Admins can mutate categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Policies: Products
drop policy if exists "Public can view products" on public.products;
create policy "Public can view products" on public.products
  for select using (true);
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products
  for insert with check (public.is_admin());
drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products
  for delete using (public.is_admin());

-- Register the store owner in Supabase Auth first, then promote only that account:
-- update public.profiles set role = 'admin' where email = 'owner@example.com';
