-- Enable additional extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Domain enums
create type public.profile_role as enum ('freelancer', 'employer', 'admin');
create type public.job_budget_mode as enum ('fixed', 'hourly');
create type public.job_status as enum ('draft', 'open', 'in_progress', 'completed', 'cancelled');
create type public.experience_level as enum ('entry', 'mid', 'expert');
create type public.proposal_status as enum ('submitted', 'shortlisted', 'hired', 'declined', 'withdrawn');
create type public.contract_status as enum ('pending', 'active', 'submitted', 'completed', 'cancelled', 'disputed');
create type public.milestone_status as enum ('pending', 'in_review', 'approved', 'rejected', 'released');
create type public.transaction_type as enum ('deposit', 'escrow_fund', 'release', 'withdrawal', 'adjustment');
create type public.transaction_status as enum ('pending', 'cleared', 'failed');
create type public.withdrawal_status as enum ('pending', 'processing', 'completed', 'rejected');
create type public.dispute_status as enum ('open', 'under_review', 'resolved', 'closed');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  role public.profile_role not null default 'freelancer',
  avatar_url text,
  title text,
  company_name text,
  bio text,
  hourly_rate numeric(10,2),
  skills text[] not null default '{}',
  location text,
  phone text,
  website text,
  onboarding_complete boolean not null default false,
  is_suspended boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index profiles_role_idx on public.profiles (role);
create index profiles_skills_idx on public.profiles using gin (skills);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles on delete cascade,
  title text not null,
  description text,
  image_url text,
  external_link text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  budget_mode public.job_budget_mode not null,
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  skills text[] not null default '{}'::text[],
  status public.job_status not null default 'open',
  location text,
  deadline date,
  experience_level experience_level not null default 'mid',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index jobs_category_idx on public.jobs (category);
create index jobs_status_idx on public.jobs (status);
create index jobs_skills_idx on public.jobs using gin (skills);
create index jobs_search_idx on public.jobs using gin (to_tsvector('english', title || ' ' || coalesce(description, '')));

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs on delete cascade,
  freelancer_id uuid not null references public.profiles on delete cascade,
  cover_letter text not null,
  bid_amount numeric(12,2) not null,
  bid_type public.job_budget_mode not null,
  estimated_hours integer,
  status public.proposal_status not null default 'submitted',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (job_id, freelancer_id)
);

create index proposals_job_idx on public.proposals (job_id);
create index proposals_freelancer_idx on public.proposals (freelancer_id);
create index proposals_status_idx on public.proposals (status);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references public.proposals on delete set null,
  job_id uuid not null references public.jobs on delete cascade,
  employer_id uuid not null references public.profiles on delete cascade,
  freelancer_id uuid not null references public.profiles on delete cascade,
  status public.contract_status not null default 'pending',
  escrow_amount numeric(12,2),
  start_date date,
  end_date date,
  notes text,
  manual_payment_reference text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index contracts_status_idx on public.contracts (status);
create index contracts_employer_idx on public.contracts (employer_id);
create index contracts_freelancer_idx on public.contracts (freelancer_id);

create table public.contract_milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts on delete cascade,
  title text not null,
  amount numeric(12,2) not null,
  due_date date,
  status public.milestone_status not null default 'pending',
  deliverable_url text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index contract_milestones_contract_idx on public.contract_milestones (contract_id);
create index contract_milestones_status_idx on public.contract_milestones (status);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts on delete cascade,
  sender_id uuid not null references public.profiles on delete cascade,
  content text not null,
  attachments jsonb not null default '[]'::jsonb,
  read_by uuid[] not null default '{}'::uuid[],
  created_at timestamptz not null default timezone('utc', now())
);

create index messages_contract_idx on public.messages (contract_id, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  type text not null,
  payload jsonb not null,
  read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index notifications_user_idx on public.notifications (user_id, read);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  type public.transaction_type not null,
  amount numeric(12,2) not null,
  reference text,
  status public.transaction_status not null default 'pending',
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index wallet_transactions_user_idx on public.wallet_transactions (user_id);

create table public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  freelancer_id uuid not null references public.profiles on delete cascade,
  amount numeric(12,2) not null,
  bank_account_name text not null,
  bank_account_number text not null,
  bank_name text not null,
  mobile_wallet_number text,
  status public.withdrawal_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index withdrawal_requests_freelancer_idx on public.withdrawal_requests (freelancer_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts on delete cascade,
  reviewer_id uuid not null references public.profiles on delete cascade,
  reviewee_id uuid not null references public.profiles on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (contract_id, reviewer_id)
);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts on delete cascade,
  opened_by uuid not null references public.profiles on delete cascade,
  reason text not null,
  status public.dispute_status not null default 'open',
  resolution text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  commission_percentage numeric(5,2) not null default 10,
  bank_account_name text,
  bank_account_number text,
  bank_name text,
  mobile_wallet_provider text,
  mobile_wallet_number text,
  updated_at timestamptz not null default timezone('utc', now())
);

-- Helper functions
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.touch_updated_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Update triggers
create trigger touch_profiles_updated
before update on public.profiles
for each row execute procedure public.touch_updated_column();

create trigger touch_jobs_updated
before update on public.jobs
for each row execute procedure public.touch_updated_column();

create trigger touch_proposals_updated
before update on public.proposals
for each row execute procedure public.touch_updated_column();

create trigger touch_contracts_updated
before update on public.contracts
for each row execute procedure public.touch_updated_column();

create trigger touch_contract_milestones_updated
before update on public.contract_milestones
for each row execute procedure public.touch_updated_column();

create trigger touch_withdrawal_requests_updated
before update on public.withdrawal_requests
for each row execute procedure public.touch_updated_column();

create trigger touch_disputes_updated
before update on public.disputes
for each row execute procedure public.touch_updated_column();

create trigger touch_admin_settings_updated
before update on public.admin_settings
for each row execute procedure public.touch_updated_column();

-- Automatic profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata jsonb := new.raw_user_meta_data;
  role_text text := coalesce(metadata->>'role', 'freelancer');
begin
  insert into public.profiles (id, full_name, role, company_name, bio)
  values (
    new.id,
    coalesce(metadata->>'full_name', new.email),
    role_text::public.profile_role,
    metadata->>'company_name',
    metadata->>'short_bio'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Row Level Security Policies
alter table public.profiles enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.jobs enable row level security;
alter table public.proposals enable row level security;
alter table public.contracts enable row level security;
alter table public.contract_milestones enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.disputes enable row level security;
alter table public.admin_settings enable row level security;

-- Profiles policies
create policy "Profiles are readable by authenticated users"
  on public.profiles
  for select
  using (auth.role() = 'authenticated');

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Portfolio policies
create policy "Portfolio items readable by all authenticated users"
  on public.portfolio_items
  for select
  using (auth.role() = 'authenticated');

create policy "Freelancers manage their portfolio"
  on public.portfolio_items
  for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Jobs policies
create policy "Jobs readable by authenticated users"
  on public.jobs
  for select
  using (auth.role() = 'authenticated');

create policy "Employers manage their jobs"
  on public.jobs
  for all
  using (auth.uid() = employer_id)
  with check (auth.uid() = employer_id);

-- Proposals policies
create policy "Proposals readable to participants"
  on public.proposals
  for select
  using (
    auth.uid() = freelancer_id
    or auth.uid() in (
      select employer_id from public.jobs where id = job_id
    )
  );

create policy "Freelancers can create proposals"
  on public.proposals
  for insert
  with check (
    auth.uid() = freelancer_id
  );

create policy "Freelancers manage their proposals"
  on public.proposals
  for update
  using (auth.uid() = freelancer_id)
  with check (auth.uid() = freelancer_id);

create policy "Employers can update proposal status"
  on public.proposals
  for update
  using (
    auth.uid() in (select employer_id from public.jobs where id = job_id)
  )
  with check (
    auth.uid() in (select employer_id from public.jobs where id = job_id)
  );

-- Contracts policies
create policy "Contracts visible to participants"
  on public.contracts
  for select
  using (auth.uid() = employer_id or auth.uid() = freelancer_id or public.is_admin());

create policy "Employers can create contracts"
  on public.contracts
  for insert
  with check (auth.uid() = employer_id);

create policy "Participants can update contracts"
  on public.contracts
  for update
  using (auth.uid() = employer_id or auth.uid() = freelancer_id or public.is_admin())
  with check (auth.uid() = employer_id or auth.uid() = freelancer_id or public.is_admin());

-- Milestones policies
create policy "Milestones visible to contract participants"
  on public.contract_milestones
  for select
  using (
    auth.uid() in (
      select employer_id from public.contracts where id = contract_id
    ) or auth.uid() in (
      select freelancer_id from public.contracts where id = contract_id
    )
  );

create policy "Employers create milestones"
  on public.contract_milestones
  for insert
  with check (
    auth.uid() in (
      select employer_id from public.contracts where id = contract_id
    )
  );

create policy "Participants update milestones"
  on public.contract_milestones
  for update
  using (
    auth.uid() in (
      select employer_id from public.contracts where id = contract_id
    ) or auth.uid() in (
      select freelancer_id from public.contracts where id = contract_id
    )
  )
  with check (
    auth.uid() in (
      select employer_id from public.contracts where id = contract_id
    ) or auth.uid() in (
      select freelancer_id from public.contracts where id = contract_id
    )
  );

-- Messages policies
create policy "Messages visible to participants"
  on public.messages
  for select
  using (
    auth.uid() in (
      select employer_id from public.contracts where id = contract_id
    ) or auth.uid() in (
      select freelancer_id from public.contracts where id = contract_id
    )
  );

create policy "Participants can send messages"
  on public.messages
  for insert
  with check (
    auth.uid() = sender_id and auth.uid() in (
      select employer_id from public.contracts where id = contract_id
      union
      select freelancer_id from public.contracts where id = contract_id
    )
  );

-- Notifications policies
create policy "Users read their notifications"
  on public.notifications
  for select
  using (auth.uid() = user_id);

create policy "System creates notifications"
  on public.notifications
  for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "Users update their notifications"
  on public.notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Wallet transactions policies
create policy "Transactions visible to owner"
  on public.wallet_transactions
  for select
  using (auth.uid() = user_id or public.is_admin());

create policy "System creates transactions"
  on public.wallet_transactions
  for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "Admin updates transactions"
  on public.wallet_transactions
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Withdrawal requests policies
create policy "Freelancers view their withdrawal requests"
  on public.withdrawal_requests
  for select
  using (auth.uid() = freelancer_id or public.is_admin());

create policy "Freelancers create withdrawal requests"
  on public.withdrawal_requests
  for insert
  with check (auth.uid() = freelancer_id);

create policy "Freelancers update pending withdrawals"
  on public.withdrawal_requests
  for update
  using (auth.uid() = freelancer_id and status = 'pending')
  with check (auth.uid() = freelancer_id);

create policy "Admin manages withdrawals"
  on public.withdrawal_requests
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Reviews policies
create policy "Reviews visible to participants"
  on public.reviews
  for select
  using (
    auth.uid() = reviewer_id or auth.uid() = reviewee_id or public.is_admin()
  );

create policy "Participants create reviews"
  on public.reviews
  for insert
  with check (
    auth.uid() = reviewer_id
  );

-- Disputes policies
create policy "Disputes visible to participants and admin"
  on public.disputes
  for select
  using (
    auth.uid() = opened_by
    or auth.uid() in (
      select employer_id from public.contracts where id = contract_id
    )
    or auth.uid() in (
      select freelancer_id from public.contracts where id = contract_id
    )
    or public.is_admin()
  );

create policy "Participants open disputes"
  on public.disputes
  for insert
  with check (
    auth.uid() = opened_by
  );

create policy "Admin updates disputes"
  on public.disputes
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admin settings policies
create policy "Admin read settings"
  on public.admin_settings
  for select
  using (public.is_admin());

create policy "Admin manage settings"
  on public.admin_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());
