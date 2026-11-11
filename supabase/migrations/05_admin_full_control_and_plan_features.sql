-- Migration: 05_admin_full_control_and_plan_features.sql
-- Fekrto (فكرتو): Admin Full Control, Plan Features (Paywall Settings) & Activity Logs

-- 1. Seed Plan Feature Configuration in site_settings
insert into public.site_settings (key, value, description)
values
  (
    'plan_features',
    '{
      "free": {
        "max_schedules": 1,
        "max_tasks_per_day": 10,
        "habits_enabled": false,
        "analytics_enabled": false,
        "streaks_enabled": false,
        "templates_enabled": false,
        "export_pdf_enabled": false,
        "priority_support": false
      },
      "pro": {
        "max_schedules": 999,
        "max_tasks_per_day": 999,
        "habits_enabled": true,
        "analytics_enabled": true,
        "streaks_enabled": true,
        "templates_enabled": true,
        "export_pdf_enabled": true,
        "priority_support": true
      }
    }'::jsonb,
    'التحكم في مميزات الباقات والقيود على الخطة المجانية'
  )
on conflict (key) do update
set value = coalesce(public.site_settings.value, excluded.value);

-- 2. System Maintenance & Announcement Bar Config
insert into public.site_settings (key, value, description)
values
  (
    'system_announcements',
    '{
      "maintenance_mode": false,
      "announcement_enabled": true,
      "announcement_text": "دعم كامل لكافة الدول العربية مع العملات المحلية وطرق الدفع المفضلة لديك 🌍",
      "announcement_badge": "جديد الوطن العربي"
    }'::jsonb,
    'شريط الإعلانات العام ووضع صيانة النظام'
  )
on conflict (key) do nothing;

-- 3. Ensure Activity Logs Table is properly indexed and secured
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists activity_logs_user_id_idx on public.activity_logs(user_id);
create index if not exists activity_logs_action_idx on public.activity_logs(action);
alter table public.activity_logs enable row level security;

drop policy if exists "Admins can view activity logs" on public.activity_logs;
create policy "Admins can view activity logs"
  on public.activity_logs for select
  using (public.is_admin(auth.uid()));

drop policy if exists "Admins can create activity logs" on public.activity_logs;
create policy "Admins can create activity logs"
  on public.activity_logs for insert
  with check (auth.role() = 'authenticated');
