-- Migration: 03_habits_templates_and_enhancements.sql
-- Fekrto (فكرتو) Platform: Habits, Templates & Task Category Enhancements
 
-- 1. Extend Tasks table safely with category_id and color
alter table public.tasks 
  add column if not exists category_id uuid references public.task_categories(id) on delete set null,
  add column if not exists color text default '#10b981';

create index if not exists tasks_category_id_idx on public.tasks(category_id);

-- 2. Monthly Habits Table (العادات الشهرية)
create table if not exists public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text default 'Sparkles',
  color text default '#10b981',
  target_days_per_week integer default 7,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists habits_user_id_idx on public.habits(user_id);
alter table public.habits enable row level security;

-- Habits RLS
drop policy if exists "Users can manage their own habits" on public.habits;
create policy "Users can manage their own habits"
  on public.habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Daily Habit Logs Table (سجلات تنفيذ العادات اليومية)
create table if not exists public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  is_completed boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (habit_id, date)
);

create index if not exists habit_logs_user_date_idx on public.habit_logs(user_id, date);
alter table public.habit_logs enable row level security;

-- Habit Logs RLS
drop policy if exists "Users can manage their own habit logs" on public.habit_logs;
create policy "Users can manage their own habit logs"
  on public.habit_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Schedule Templates Table (القوالب الجاهزة الاختيارية)
create table if not exists public.schedule_templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade, -- null for system public templates
  name text not null,
  description text,
  category text not null check (category in ('blank', 'work', 'study', 'balanced', 'custom')),
  color text default '#0d9488',
  icon text default 'Briefcase',
  is_system boolean default false,
  structure jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists schedule_templates_category_idx on public.schedule_templates(category);
alter table public.schedule_templates enable row level security;

-- Schedule Templates RLS
drop policy if exists "Anyone can read system templates" on public.schedule_templates;
create policy "Anyone can read system templates"
  on public.schedule_templates for select
  using (is_system = true or auth.uid() = user_id);

drop policy if exists "Users can manage their custom templates" on public.schedule_templates;
create policy "Users can manage their custom templates"
  on public.schedule_templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Seed default system templates (الـ 4 قوالب الأساسية في الصورة)
insert into public.schedule_templates (name, description, category, color, icon, is_system, structure)
values
(
  'جدول فارغ',
  'ابدأ من الصفر وأنشئ جدولك الخاص بحرية كاملة دون أي مهام مسبقة',
  'blank',
  '#0d9488',
  'PlusCircle',
  true,
  '{
    "schedule_type": "weekly",
    "days_count": 7,
    "default_tasks": []
  }'::jsonb
),
(
  'قالب العمل',
  'مناسب للمحترفين ورواد الأعمال وأصحاب المشاريع لتنظيم المهام والاجتماعات وجلسات العمل العميق',
  'work',
  '#0284c7',
  'Briefcase',
  true,
  '{
    "schedule_type": "weekly",
    "days_count": 7,
    "default_tasks": [
      {"title": "مراجعة خطة المشروع والمهام", "start_time": "09:00", "end_time": "10:00", "priority": "high", "color": "#ef4444"},
      {"title": "الرد على رسائل العملاء والبريد", "start_time": "10:30", "end_time": "11:30", "priority": "medium", "color": "#f59e0b"},
      {"title": "جلسة عمل عميق: تطوير ومتابعة", "start_time": "12:00", "end_time": "13:30", "priority": "high", "color": "#ef4444"},
      {"title": "اجتماع فريق العمل اليومي", "start_time": "14:00", "end_time": "15:00", "priority": "medium", "color": "#3b82f6"}
    ],
    "default_habits": ["مراجعة البريد في وقت محدد", "جلسة تركيز 90 دقيقة", "توثيق إنجازات اليوم"]
  }'::jsonb
),
(
  'قالب الدراسة',
  'مصمم خصيصاً للطلاب والباحثين لتحقيق أقصى درجات التركيز والتفوق الأكاديمي',
  'study',
  '#7c3aed',
  'GraduationCap',
  true,
  '{
    "schedule_type": "weekly",
    "days_count": 7,
    "default_tasks": [
      {"title": "مراجعة المحاضرات الصباحية", "start_time": "08:30", "end_time": "10:30", "priority": "high", "color": "#8b5cf6"},
      {"title": "حل التمارين والواجبات", "start_time": "11:00", "end_time": "13:00", "priority": "medium", "color": "#3b82f6"},
      {"title": "قراءة بحثية وإعداد الملخصات", "start_time": "16:00", "end_time": "17:30", "priority": "low", "color": "#10b981"},
      {"title": "مراجعة شاملة لدروس اليوم", "start_time": "20:00", "end_time": "21:00", "priority": "high", "color": "#ef4444"}
    ],
    "default_habits": ["قراءة 30 صفحة يومياً", "مذاكرة بتقنية بومودورو", "النوم قبل 11 مساءً"]
  }'::jsonb
),
(
  'قالب الحياة المتوازنة',
  'يوازن بين العمل، الدراسة، العائلة، والصحة لعيش يوم متكامل وهادئ',
  'balanced',
  '#f97316',
  'Heart',
  true,
  '{
    "schedule_type": "weekly",
    "days_count": 7,
    "default_tasks": [
      {"title": "صلاة الفجر وورد الصباح ورياضة خفيفة", "start_time": "05:30", "end_time": "06:30", "priority": "high", "color": "#10b981"},
      {"title": "فترة العمل الصباحية الأكثر إنتاجية", "start_time": "09:00", "end_time": "12:30", "priority": "high", "color": "#ef4444"},
      {"title": "قراءة وتطوير الذات", "start_time": "15:00", "end_time": "16:00", "priority": "low", "color": "#06b6d4"},
      {"title": "ممارسة الرياضة 45 دقيقة", "start_time": "17:30", "end_time": "18:15", "priority": "medium", "color": "#f59e0b"},
      {"title": "وقت عائلي واستراحة مسائية", "start_time": "19:30", "end_time": "21:30", "priority": "high", "color": "#ec4899"}
    ],
    "default_habits": ["شرب 2 لتر ماء", "رياضة 30 دقيقة", "ورد القرآن اليومي", "وقت بدون شاشات قبل النوم"]
  }'::jsonb
)
on conflict do nothing;
