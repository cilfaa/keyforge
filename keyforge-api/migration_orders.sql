-- Jalankan file ini di Supabase > SQL Editor > New query > RUN
-- Menambahkan kolom stok pada keyboards serta tabel akun, pesanan, dan item pesanan.

alter table keyboards
  add column if not exists stock integer not null default 15;

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,
  idempotency_key text unique,
  user_id uuid not null references app_users(id) on delete cascade,
  customer_name text not null,
  shipping_address text not null,
  note text,
  payment_method text not null,
  payment_status text not null default 'Pending',
  order_status text not null default 'Pending',
  subtotal numeric(12,0) not null default 0,
  shipping_cost numeric(12,0) not null default 0,
  total_price numeric(12,0) not null default 0,
  payment_ref text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  keyboard_id uuid references keyboards(id) on delete set null,
  keyboard_name text not null,
  keyboard_brand text,
  keyboard_layout text,
  unit_price numeric(12,0) not null,
  quantity integer not null,
  subtotal numeric(12,0) not null
);
