-- Supabase Migration: 01_initial_schema.sql
-- Fekrto (فكرتو) Platform Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  age integer not null check (age >= 18),
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin', 'super_admin')),
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for profiles
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_role_idx on public.profiles(role);

-- 2. SUBSCRIPTION PLANS TABLE
create table if not exists public.subscription_plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  name_ar text not null,
  description text,
  price_monthly numeric(10,2) not null default 29.00,
  price_yearly numeric(10,2) not null default 199.00,
  features jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. COUPONS TABLE
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  max_uses integer,
  used_count integer default 0,
  min_amount numeric(10,2) default 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. COUPON USAGES TABLE
create table if not exists public.coupon_usages (
  id uuid default gen_random_uuid() primary key,
  coupon_id uuid references public.coupons(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  used_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PAYMENT METHODS TABLE
create table if not exists public.payment_methods (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  name_ar text not null,
  description text,
  instructions text,
  account_details jsonb default '{}'::jsonb,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.subscription_plans(id) not null,
  status text not null default 'pending' check (status in ('active', 'expired', 'cancelled', 'pending')),
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone not null,
  is_yearly boolean default false,
  amount_paid numeric(10,2) not null default 0,
  discount_amount numeric(10,2) default 0,
  coupon_id uuid references public.coupons(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

-- 7. PAYMENT REQUESTS TABLE
create table if not exists public.payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  plan_id uuid references public.subscription_plans(id) not null,
  is_yearly boolean default false,
  coupon_id uuid references public.coupons(id) on delete set null,
  payment_method_id uuid references public.payment_methods(id) not null,
  amount numeric(10,2) not null,
  currency text default 'SAR',
  proof_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  rejection_reason text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists payment_requests_user_id_idx on public.payment_requests(user_id);
create index if not exists payment_requests_status_idx on public.payment_requests(status);

-- 8. SCHEDULES TABLE
create table if not exists public.schedules (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  type text not null check (type in ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
  start_date date not null,
  end_date date not null,
  is_active boolean default true,
  color text default '#4f46e5',
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists schedules_user_id_idx on public.schedules(user_id);

-- 9. SCHEDULE DAYS TABLE
create table if not exists public.schedule_days (
  id uuid default gen_random_uuid() primary key,
  schedule_id uuid references public.schedules(id) on delete cascade not null,
  date date not null,
  day_name text,
  notes text,
  is_completed boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (schedule_id, date)
);

create index if not exists schedule_days_schedule_id_idx on public.schedule_days(schedule_id);
create index if not exists schedule_days_date_idx on public.schedule_days(date);

-- 10. TASK CATEGORIES TABLE
create table if not exists public.task_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#4f46e5',
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. TASKS TABLE
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  schedule_day_id uuid references public.schedule_days(id) on delete cascade not null,
  schedule_id uuid references public.schedules(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_time time,
  end_time time,
  duration_minutes integer,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text default 'not_started' check (status in ('not_started', 'in_progress', 'completed', 'postponed', 'cancelled')),
  is_completed boolean default false,
  notes text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_schedule_id_idx on public.tasks(schedule_id);
create index if not exists tasks_schedule_day_id_idx on public.tasks(schedule_day_id);
create index if not exists tasks_status_idx on public.tasks(status);

-- 12. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info',
  is_read boolean default false,
  action_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);

-- 13. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id) on delete set null
);

-- 14. LEGAL PAGES TABLE
create table if not exists public.legal_pages (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  content text not null,
  is_published boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id) on delete set null
);

-- 15. ACTIVITY LOGS TABLE
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role in ('admin', 'super_admin')
  );
end;
$$ language plpgsql security definer;

-- Trigger: Update updated_at on record change
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();
create trigger update_subscription_plans_updated_at before update on public.subscription_plans
  for each row execute function public.update_updated_at_column();
create trigger update_coupons_updated_at before update on public.coupons
  for each row execute function public.update_updated_at_column();
create trigger update_payment_methods_updated_at before update on public.payment_methods
  for each row execute function public.update_updated_at_column();
create trigger update_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.update_updated_at_column();
create trigger update_payment_requests_updated_at before update on public.payment_requests
  for each row execute function public.update_updated_at_column();
create trigger update_schedules_updated_at before update on public.schedules
  for each row execute function public.update_updated_at_column();
create trigger update_schedule_days_updated_at before update on public.schedule_days
  for each row execute function public.update_updated_at_column();
create trigger update_tasks_updated_at before update on public.tasks
  for each row execute function public.update_updated_at_column();

-- Trigger: Automatically create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_age integer;
  user_phone text;
  user_fullname text;
begin
  -- Extract metadata safely
  user_age := coalesce((new.raw_user_meta_data->>'age')::integer, 18);
  user_phone := new.raw_user_meta_data->>'phone';
  user_fullname := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  -- Check age >= 18
  if user_age < 18 then
    raise exception 'يجب أن يكون العمر 18 عامًا على الأقل للتسجيل في المنصة';
  end if;

  insert into public.profiles (id, full_name, email, phone, age, role, is_active)
  values (
    new.id,
    user_fullname,
    new.email,
    user_phone,
    user_age,
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    true
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop if exists and recreate trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: Re-evaluate schedule day completion when tasks change
-- Rule: Day is completed only if ALL required tasks (excluding 'cancelled') are completed, and there is at least 1 task
create or replace function public.recalculate_day_completion()
returns trigger as $$
declare
  target_day_id uuid;
  total_required integer;
  total_completed integer;
begin
  if tg_op = 'DELETE' then
    target_day_id := old.schedule_day_id;
  else
    target_day_id := new.schedule_day_id;
  end if;

  select
    count(*) filter (where status != 'cancelled'),
    count(*) filter (where is_completed = true and status != 'cancelled')
  into total_required, total_completed
  from public.tasks
  where schedule_day_id = target_day_id;

  update public.schedule_days
  set is_completed = (total_required > 0 and total_required = total_completed)
  where id = target_day_id;

  return null;
end;
$$ language plpgsql;

create trigger trigger_recalculate_day_completion
  after insert or update or delete on public.tasks
  for each row execute function public.recalculate_day_completion();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_usages enable row level security;
alter table public.payment_methods enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_requests enable row level security;
alter table public.schedules enable row level security;
alter table public.schedule_days enable row level security;
alter table public.task_categories enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.site_settings enable row level security;
alter table public.legal_pages enable row level security;
alter table public.activity_logs enable row level security;

-- Profiles Policies
create policy "Users can view their own profile or admins view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Users can update their own profile or admins update all"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin(auth.uid()));

-- Subscription Plans Policies
create policy "Anyone can view active plans"
  on public.subscription_plans for select
  using (is_active = true or public.is_admin(auth.uid()));

create policy "Admins can manage plans"
  on public.subscription_plans for all
  using (public.is_admin(auth.uid()));

-- Payment Methods Policies
create policy "Anyone can view active payment methods"
  on public.payment_methods for select
  using (is_active = true or public.is_admin(auth.uid()));

create policy "Admins can manage payment methods"
  on public.payment_methods for all
  using (public.is_admin(auth.uid()));

-- Coupons Policies
create policy "Users can view active coupons by code"
  on public.coupons for select
  using (is_active = true or public.is_admin(auth.uid()));

create policy "Admins can manage coupons"
  on public.coupons for all
  using (public.is_admin(auth.uid()));

-- Coupon Usages Policies
create policy "Users can view their own coupon usages"
  on public.coupon_usages for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Users can insert coupon usage"
  on public.coupon_usages for insert
  with check (auth.uid() = user_id);

-- Subscriptions Policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Admins can manage all subscriptions"
  on public.subscriptions for all
  using (public.is_admin(auth.uid()));

-- Payment Requests Policies
create policy "Users can view their own payment requests"
  on public.payment_requests for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Users can create their own payment requests"
  on public.payment_requests for insert
  with check (auth.uid() = user_id);

create policy "Admins can view and update all payment requests"
  on public.payment_requests for all
  using (public.is_admin(auth.uid()));

-- Schedules Policies
create policy "Users can manage their own schedules"
  on public.schedules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Schedule Days Policies
create policy "Users can manage their own schedule days"
  on public.schedule_days for all
  using (
    exists (
      select 1 from public.schedules
      where schedules.id = schedule_days.schedule_id and schedules.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.schedules
      where schedules.id = schedule_days.schedule_id and schedules.user_id = auth.uid()
    )
  );

-- Task Categories Policies
create policy "Users can manage their own categories"
  on public.task_categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Tasks Policies
create policy "Users can manage their own tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notifications Policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Site Settings Policies
create policy "Anyone can view site settings"
  on public.site_settings for select
  using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (public.is_admin(auth.uid()));

-- Legal Pages Policies
create policy "Anyone can view published legal pages"
  on public.legal_pages for select
  using (is_published = true or public.is_admin(auth.uid()));

create policy "Admins can manage legal pages"
  on public.legal_pages for all
  using (public.is_admin(auth.uid()));

-- Activity Logs Policies
create policy "Admins can view activity logs"
  on public.activity_logs for select
  using (public.is_admin(auth.uid()));

create policy "Authenticated users can insert activity logs"
  on public.activity_logs for insert
  with check (auth.uid() = user_id or user_id is null);
