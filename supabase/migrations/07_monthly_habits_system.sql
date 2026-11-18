-- Migration: 07_monthly_habits_system.sql
-- Fekrto (فكرتو): Monthly Habits Hub (مركز متابعة العادات الشهرية)
-- Safe, additive enhancements for Habits, Recurrence, Settings, Motivational Content & Templates

-- 1. Extend public.habits safely
ALTER TABLE public.habits
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS recurrence_type text DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS target_days_json jsonb DEFAULT '["0","1","2","3","4","5","6"]'::jsonb,
  ADD COLUMN IF NOT EXISTS monthly_target integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS weekly_target integer DEFAULT 7,
  ADD COLUMN IF NOT EXISTS rest_days_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date date,
  ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_unit text DEFAULT 'مرة';

CREATE INDEX IF NOT EXISTS habits_is_archived_idx ON public.habits(is_archived);
CREATE INDEX IF NOT EXISTS habits_category_idx ON public.habits(category);

-- 2. User Monthly Habit Settings (طريقة العرض، تدوير الصور، الصوت، الشهور المغلقة)
CREATE TABLE IF NOT EXISTS public.monthly_habit_settings (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  preferred_view text DEFAULT 'original' CHECK (preferred_view IN ('original', 'enhanced')),
  auto_rotate_images boolean DEFAULT true,
  rotate_interval_seconds integer DEFAULT 30,
  sound_enabled boolean DEFAULT false,
  sound_volume numeric(3,2) DEFAULT 0.5,
  favorite_images jsonb DEFAULT '[]'::jsonb,
  reduced_motion boolean DEFAULT false,
  locked_months jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.monthly_habit_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own monthly habit settings" ON public.monthly_habit_settings;
CREATE POLICY "Users can manage their own monthly habit settings"
  ON public.monthly_habit_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Motivational Content Table (الصور والجمل التحفيزية الحية)
CREATE TABLE IF NOT EXISTS public.motivational_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  category text DEFAULT 'mixed' CHECK (category IN ('nature', 'cosmic', 'cinematic', 'fantasy', 'mixed')),
  quote_ar text NOT NULL,
  quote_subtext text,
  milestone_trigger text DEFAULT 'all' CHECK (milestone_trigger IN ('start_of_day', 'progress_50', 'completed_100', 'streak', 'returning', 'all')),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS motivational_content_active_idx ON public.motivational_content(is_active);
ALTER TABLE public.motivational_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active motivational content" ON public.motivational_content;
CREATE POLICY "Anyone can read active motivational content"
  ON public.motivational_content FOR SELECT
  USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage motivational content" ON public.motivational_content;
CREATE POLICY "Admins can manage motivational content"
  ON public.motivational_content FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 4. Habit Templates Table (مكتبة قوالب العادات الجاهزة)
CREATE TABLE IF NOT EXISTS public.habit_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- null for public system templates
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('worship', 'study', 'health', 'lifestyle', 'daily', 'custom', 'blank')),
  icon text DEFAULT 'Sparkles',
  color text DEFAULT '#10b981',
  is_system boolean DEFAULT false,
  habits_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS habit_templates_category_idx ON public.habit_templates(category);
ALTER TABLE public.habit_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view system or own habit templates" ON public.habit_templates;
CREATE POLICY "Users can view system or own habit templates"
  ON public.habit_templates FOR SELECT
  USING (is_system = true OR auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can manage own habit templates" ON public.habit_templates;
CREATE POLICY "Users can manage own habit templates"
  ON public.habit_templates FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage system habit templates" ON public.habit_templates;
CREATE POLICY "Admins can manage system habit templates"
  ON public.habit_templates FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 5. Seed 6 Master Motivational Image & Quote presets from reference image
INSERT INTO public.motivational_content (title, image_url, category, quote_ar, quote_subtext, milestone_trigger, sort_order)
VALUES
  (
    'قمة الجبل وشروق الأمل',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    'cinematic',
    'أنت أقوى من أعذارك واستمر في رحلتك نحو الأفضل',
    'كل إنجاز صغير يقربك من النسخة التي تحلم بها.',
    'start_of_day',
    1
  ),
  (
    'سديم كوني وحلقات النجوم',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    'cosmic',
    'الأحلام لا تتحقق صدفة بل بالالتزام اليومي',
    'كل عادة تغرسها في يومك هي بذرة لمستقبلك الاستثنائي.',
    'progress_50',
    2
  ),
  (
    'شلال طبيعي نقي في الغابة',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=80',
    'nature',
    'كل يوم صغير يحدث فرقاً كبيراً',
    'قطرات الماء المستمرة تفلق الصخر، واستمرارك يصنع المعجزات.',
    'streak',
    3
  ),
  (
    'مجرة لولبية متوهجة باللون البنفسجي',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    'fantasy',
    'لا تقارن بدايتك بنهاية الآخرين فلك قصتك الخاصة',
    'ركز على مسارك الخاص واحتفل بكل خطوة تخطوها.',
    'all',
    4
  ),
  (
    'سفينة تبحر نحو شمس الأصيل',
    'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1600&q=80',
    'cinematic',
    'ما تزرعه اليوم تحصده غداً',
    'الانضباط هو الجسر الواصل بين الأهداف والإنجازات الحقيقية.',
    'all',
    5
  ),
  (
    'سلاسل جبال شامخة عند الغسق',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    'nature',
    'الاستمرارية هي سر النجاح',
    'الانضباط اليوم هو الحرية غداً.',
    'completed_100',
    6
  )
ON CONFLICT DO NOTHING;

-- 6. Seed 6 Habit Templates (بما في ذلك عادات الصورة المرجعية بالكامل)
INSERT INTO public.habit_templates (title, description, category, icon, color, is_system, habits_data)
VALUES
  (
    'قالب العادات اليومية (المعتمد)',
    'حزمة العادات الـ 7 الرئيسية المطابقة تماماً لبوستر فكرتو العالمي',
    'daily',
    'Sparkles',
    '#22d3ee',
    true,
    '[
      {"name": "الصلاة", "icon": "Sun", "color": "#f59e0b", "category": "worship", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "قراءة القرآن", "icon": "BookOpen", "color": "#a855f7", "category": "worship", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "الرياضة", "icon": "Dumbbell", "color": "#f97316", "category": "health", "weekly_target": 5, "monthly_target": 22, "recurrence_type": "specific_days", "target_days_json": ["0","1","2","3","4"], "rest_days_json": ["5","6"]},
      {"name": "شرب الماء", "icon": "Droplets", "color": "#38bdf8", "category": "health", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "النوم المبكر", "icon": "Moon", "color": "#22d3ee", "category": "health", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "القراءة", "icon": "BookOpen", "color": "#f43f5e", "category": "study", "weekly_target": 6, "monthly_target": 26, "recurrence_type": "daily"},
      {"name": "الكتابة", "icon": "PenTool", "color": "#10b981", "category": "lifestyle", "weekly_target": 4, "monthly_target": 18, "recurrence_type": "specific_days", "target_days_json": ["0","2","4"]}
    ]'::jsonb
  ),
  (
    'قالب العبادات والطاعات',
    'خطة الالتزام بالفرائض والسنن والورد القرآني اليومي',
    'worship',
    'Sun',
    '#f59e0b',
    true,
    '[
      {"name": "الصلاة في وقتها", "icon": "Sun", "color": "#f59e0b", "category": "worship", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "أذكار الصباح والمساء", "icon": "Sparkles", "color": "#fbbf24", "category": "worship", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "ورد القرآن اليومي", "icon": "BookOpen", "color": "#a855f7", "category": "worship", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "صلاة الوتر", "icon": "Moon", "color": "#818cf8", "category": "worship", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "الصدقة الأسبوعية", "icon": "Heart", "color": "#ec4899", "category": "worship", "weekly_target": 1, "monthly_target": 4, "recurrence_type": "times_per_week"}
    ]'::jsonb
  ),
  (
    'قالب الدراسة والتعلم',
    'خطة إتقان المذاكرة وتطوير المهارات والقراءة العميقة',
    'study',
    'GraduationCap',
    '#8b5cf6',
    true,
    '[
      {"name": "جلسة مذاكرة مركزة (بومودورو)", "icon": "Timer", "color": "#8b5cf6", "category": "study", "weekly_target": 6, "monthly_target": 26, "recurrence_type": "daily"},
      {"name": "قراءة 20 صفحة من كتاب", "icon": "BookOpen", "color": "#06b6d4", "category": "study", "weekly_target": 6, "monthly_target": 26, "recurrence_type": "daily"},
      {"name": "تعلم لغة / مهارة جديدة", "icon": "Languages", "color": "#10b981", "category": "study", "weekly_target": 5, "monthly_target": 22, "recurrence_type": "daily"},
      {"name": "حل اختبارات ومسائل", "icon": "CheckSquare", "color": "#f59e0b", "category": "study", "weekly_target": 4, "monthly_target": 18, "recurrence_type": "specific_days"}
    ]'::jsonb
  ),
  (
    'قالب الصحة والرياضة',
    'برنامج العناية باللياقة والنشاط البدني وشرب السوائل والنوم',
    'health',
    'Activity',
    '#10b981',
    true,
    '[
      {"name": "تمرين رياضي 45 دقيقة", "icon": "Dumbbell", "color": "#10b981", "category": "health", "weekly_target": 5, "monthly_target": 22, "recurrence_type": "specific_days", "target_days_json": ["0","1","2","3","4"], "rest_days_json": ["5","6"]},
      {"name": "شرب 3 لتر ماء", "icon": "Droplets", "color": "#0284c7", "category": "health", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "المشي 8000 خطوة", "icon": "Footprints", "color": "#059669", "category": "health", "weekly_target": 6, "monthly_target": 26, "recurrence_type": "daily"},
      {"name": "نوم مبكر 7-8 ساعات", "icon": "Moon", "color": "#6366f1", "category": "health", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "تناول وجبة صحية خالية من السكر", "icon": "Apple", "color": "#e11d48", "category": "health", "weekly_target": 6, "monthly_target": 26, "recurrence_type": "daily"}
    ]'::jsonb
  ),
  (
    'قالب تنظيم الحياة والإنتاجية',
    'عادات التخطيط اليومي وتفريغ الذهن وتقليل تشتت الشاشات',
    'lifestyle',
    'Compass',
    '#0ea5e9',
    true,
    '[
      {"name": "تخطيط جدول اليوم التالي مسبقاً", "icon": "CalendarCheck", "color": "#0ea5e9", "category": "lifestyle", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "ترتيب وتنظيف مساحة العمل", "icon": "Sparkles", "color": "#14b8a6", "category": "lifestyle", "weekly_target": 6, "monthly_target": 26, "recurrence_type": "daily"},
      {"name": "تقليل الشاشات قبل النوم بساعة", "icon": "SmartphoneOff", "color": "#6366f1", "category": "lifestyle", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"},
      {"name": "تدوين 3 نعم ويوميات الامتنان", "icon": "Feather", "color": "#d946ef", "category": "lifestyle", "weekly_target": 7, "monthly_target": 31, "recurrence_type": "daily"}
    ]'::jsonb
  ),
  (
    'قالب فارغ',
    'ابدأ صفحة بيضاء وأضف عاداتك الخاصة بحرية كاملة',
    'blank',
    'PlusCircle',
    '#64748b',
    true,
    '[]'::jsonb
  )
ON CONFLICT DO NOTHING;
