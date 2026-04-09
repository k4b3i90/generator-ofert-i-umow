create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  full_name text not null,
  role text not null check (role in ('owner', 'partner')),
  password_hash text not null,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_counters (
  counter_key text primary key,
  current_value integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  offer_number text not null unique,
  title text not null,
  author_user_id uuid not null references public.app_users(id),
  client_type text not null check (client_type in ('company', 'individual')),
  client_label text not null,
  client_details jsonb not null default '{}'::jsonb,
  issue_date date not null default current_date,
  valid_until date,
  notes text,
  vat_rate text not null check (vat_rate in ('23', '8', 'zw', 'bez')),
  totals_net numeric(12,2) not null default 0,
  totals_vat numeric(12,2) not null default 0,
  totals_gross numeric(12,2) not null default 0,
  warranty_months integer not null default 12,
  contract_terms jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'archived')),
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  sort_order integer not null default 0,
  item_name text not null,
  unit text not null,
  quantity numeric(12,2) not null default 0,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null unique references public.offers(id) on delete cascade,
  author_user_id uuid not null references public.app_users(id),
  contract_number text unique,
  client_label text not null,
  summary_total_label text,
  warranty_months integer not null default 12,
  contract_snapshot jsonb not null default '{}'::jsonb,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_notes (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references public.app_users(id),
  updated_by_user_id uuid references public.app_users(id),
  body text not null,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_note_entries (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.board_notes(id) on delete cascade,
  author_user_id uuid not null references public.app_users(id),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_offers_author_user_id on public.offers(author_user_id);
create index if not exists idx_offers_issue_date on public.offers(issue_date desc);
create index if not exists idx_offers_status on public.offers(status);
create index if not exists idx_offer_items_offer_id on public.offer_items(offer_id, sort_order);
create index if not exists idx_contracts_offer_id on public.contracts(offer_id);
create index if not exists idx_board_notes_created_at on public.board_notes(created_at desc);
create index if not exists idx_board_note_entries_note_id on public.board_note_entries(note_id, created_at desc);

drop trigger if exists trg_app_users_updated_at on public.app_users;
create trigger trg_app_users_updated_at
before update on public.app_users
for each row
execute function public.set_updated_at();

drop trigger if exists trg_offers_updated_at on public.offers;
create trigger trg_offers_updated_at
before update on public.offers
for each row
execute function public.set_updated_at();

drop trigger if exists trg_offer_items_updated_at on public.offer_items;
create trigger trg_offer_items_updated_at
before update on public.offer_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_contracts_updated_at on public.contracts;
create trigger trg_contracts_updated_at
before update on public.contracts
for each row
execute function public.set_updated_at();

drop trigger if exists trg_board_notes_updated_at on public.board_notes;
create trigger trg_board_notes_updated_at
before update on public.board_notes
for each row
execute function public.set_updated_at();

create or replace function public.next_offer_number(p_issue_date date default current_date)
returns text
language plpgsql
as $$
declare
  v_year text;
  v_month text;
  v_key text;
  v_next integer;
begin
  v_year := to_char(p_issue_date, 'YYYY');
  v_month := to_char(p_issue_date, 'MM');
  v_key := 'offer:' || v_year || ':' || v_month;

  insert into public.document_counters(counter_key, current_value, updated_at)
  values (v_key, 1, now())
  on conflict (counter_key)
  do update
    set current_value = public.document_counters.current_value + 1,
        updated_at = now()
  returning current_value into v_next;

  return 'OF/' || v_year || '/' || v_month || '/' || lpad(v_next::text, 3, '0');
end;
$$;

create or replace function public.verify_app_user_password(p_username text, p_password text)
returns table (
  user_id uuid,
  username text,
  full_name text,
  role text
)
language sql
stable
as $$
  select
    u.id,
    u.username,
    u.full_name,
    u.role
  from public.app_users u
  where u.username = p_username
    and u.is_active = true
    and u.password_hash = crypt(p_password, u.password_hash);
$$;

insert into public.app_users (username, full_name, role, password_hash, is_active)
values
  (
    'Piotr Kowalczyk',
    'Piotr Kowalczyk',
    'owner',
    crypt('Kowalczyk', gen_salt('bf', 10)),
    true
  ),
  (
    'Petro Pundyk',
    'Petro Pundyk',
    'partner',
    crypt('Pundyk', gen_salt('bf', 10)),
    true
  )
on conflict (username) do update
set
  full_name = excluded.full_name,
  role = excluded.role,
  password_hash = excluded.password_hash,
  is_active = excluded.is_active,
  updated_at = now();
