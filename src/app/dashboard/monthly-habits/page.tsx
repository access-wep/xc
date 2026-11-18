'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { audioChime } from '@/lib/audioChime'
import { MotivationalHeroBanner } from '@/components/habits/MotivationalHeroBanner'
import { HabitCommitmentGaugeCard } from '@/components/habits/HabitCommitmentGaugeCard'
import { ExcelMonthlyHabitGrid } from '@/components/habits/ExcelMonthlyHabitGrid'
import { ModernHabitsCardsView } from '@/components/habits/ModernHabitsCardsView'
import { HabitsAnalyticsRow } from '@/components/habits/HabitsAnalyticsRow'
import { MotivationalCarouselRow } from '@/components/habits/MotivationalCarouselRow'
import { AddEditHabitModal } from '@/components/habits/AddEditHabitModal'
import { HabitTemplatesModal } from '@/components/habits/HabitTemplatesModal'
import { HabitArchiveModal } from '@/components/habits/HabitArchiveModal'
import { HabitSettingsModal } from '@/components/habits/HabitSettingsModal'
import { HabitAIAdvisorModal } from '@/components/habits/HabitAIAdvisorModal'
import { Modal, Button } from '@/components/ui'
import {
  Sparkles,
  Bot,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import type {
  Habit,
  HabitLog,
  MonthlyHabitSettings,
  MotivationalContent,
  HabitTemplate,
} from '@/types/database'

// Master Motivational Content Fallback (matches image)
const DEFAULT_MOTIVATIONAL_CARDS: MotivationalContent[] = [
  {
    id: 'm1',
    title: 'قمة الجبل وشروق الأمل',
    image_url:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    category: 'cinematic',
    quote_ar: 'أنت أقوى من أعذارك واستمر في رحلتك نحو الأفضل',
    quote_subtext: 'كل إنجاز صغير يقربك من النسخة التي تحلم بها.',
    milestone_trigger: 'start_of_day',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm2',
    title: 'سديم كوني وحلقات النجوم',
    image_url:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    category: 'cosmic',
    quote_ar: 'الأحلام لا تتحقق صدفة بل بالالتزام اليومي',
    quote_subtext: 'كل عادة تغرسها في يومك هي بذرة لمستقبلك الاستثنائي.',
    milestone_trigger: 'progress_50',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm3',
    title: 'شلال طبيعي نقي في الغابة',
    image_url:
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=80',
    category: 'nature',
    quote_ar: 'كل يوم صغير يحدث فرقاً كبيراً',
    quote_subtext: 'قطرات الماء المستمرة تفلق الصخر، واستمرارك يصنع المعجزات.',
    milestone_trigger: 'streak',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm4',
    title: 'مجرة لولبية متوهجة باللون البنفسجي',
    image_url:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    category: 'fantasy',
    quote_ar: 'لا تقارن بدايتك بنهاية الآخرين فلك قصتك الخاصة',
    quote_subtext: 'ركز على مسارك الخاص واحتفل بكل خطوة تخطوها.',
    milestone_trigger: 'all',
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm5',
    title: 'سفينة تبحر نحو شمس الأصيل',
    image_url:
      'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1600&q=80',
    category: 'cinematic',
    quote_ar: 'ما تزرعه اليوم تحصده غداً',
    quote_subtext: 'الانضباط هو الجسر الواصل بين الأهداف والإنجازات الحقيقية.',
    milestone_trigger: 'all',
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm6',
    title: 'سلاسل جبال شامخة عند الغسق',
    image_url:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    category: 'nature',
    quote_ar: 'الاستمرارية هي سر النجاح',
    quote_subtext: 'الانضباط اليوم هو الحرية غداً.',
    milestone_trigger: 'completed_100',
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
]

// Fallback System Templates (matches image)
const DEFAULT_SYSTEM_TEMPLATES: HabitTemplate[] = [
  {
    id: 't-daily',
    user_id: null,
    title: 'قالب العادات اليومية (المعتمد)',
    description: 'حزمة العادات الـ 7 الرئيسية المطابقة تماماً لبوستر فكرتو العالمي',
    category: 'daily',
    icon: 'Sparkles',
    color: '#22d3ee',
    is_system: true,
    habits_data: [
      { name: 'الصلاة', icon: 'Sun', color: '#f59e0b', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'قراءة القرآن', icon: 'BookOpen', color: '#a855f7', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'الرياضة', icon: 'Dumbbell', color: '#f97316', weekly_target: 5, monthly_target: 22, recurrence_type: 'specific_days', target_days_json: ['0','1','2','3','4'], rest_days_json: ['5','6'] },
      { name: 'شرب الماء', icon: 'Droplets', color: '#38bdf8', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'النوم المبكر', icon: 'Moon', color: '#22d3ee', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'القراءة', icon: 'BookOpen', color: '#f43f5e', weekly_target: 6, monthly_target: 26, recurrence_type: 'daily' },
      { name: 'الكتابة', icon: 'PenTool', color: '#10b981', weekly_target: 4, monthly_target: 18, recurrence_type: 'specific_days', target_days_json: ['0','2','4'] },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 't-worship',
    user_id: null,
    title: 'قالب العبادات والطاعات',
    description: 'خطة الالتزام بالفرائض والسنن والورد القرآني اليومي',
    category: 'worship',
    icon: 'Sun',
    color: '#f59e0b',
    is_system: true,
    habits_data: [
      { name: 'الصلاة في وقتها', icon: 'Sun', color: '#f59e0b', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'أذكار الصباح والمساء', icon: 'Sparkles', color: '#fbbf24', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'ورد القرآن اليومي', icon: 'BookOpen', color: '#a855f7', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'صلاة الوتر', icon: 'Moon', color: '#818cf8', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 't-study',
    user_id: null,
    title: 'قالب الدراسة والتعلم',
    description: 'خطة إتقان المذاكرة وتطوير المهارات والقراءة العميقة',
    category: 'study',
    icon: 'BookOpen',
    color: '#8b5cf6',
    is_system: true,
    habits_data: [
      { name: 'جلسة مذاكرة مركزة', icon: 'Timer', color: '#8b5cf6', weekly_target: 6, monthly_target: 26, recurrence_type: 'daily' },
      { name: 'قراءة 20 صفحة من كتاب', icon: 'BookOpen', color: '#06b6d4', weekly_target: 6, monthly_target: 26, recurrence_type: 'daily' },
      { name: 'تعلم مهارة جديدة', icon: 'Languages', color: '#10b981', weekly_target: 5, monthly_target: 22, recurrence_type: 'daily' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 't-health',
    user_id: null,
    title: 'قالب الصحة والرياضة',
    description: 'العناية باللياقة والنشاط البدني وشرب السوائل والنوم',
    category: 'health',
    icon: 'Dumbbell',
    color: '#10b981',
    is_system: true,
    habits_data: [
      { name: 'تمرين رياضي', icon: 'Dumbbell', color: '#10b981', weekly_target: 5, monthly_target: 22, recurrence_type: 'specific_days', target_days_json: ['0','1','2','3','4'], rest_days_json: ['5','6'] },
      { name: 'شرب 3 لتر ماء', icon: 'Droplets', color: '#0284c7', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'المشي 8000 خطوة', icon: 'Footprints', color: '#059669', weekly_target: 6, monthly_target: 26, recurrence_type: 'daily' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 't-lifestyle',
    user_id: null,
    title: 'قالب تنظيم الحياة',
    description: 'عادات التخطيط وتفريغ الذهن وتقليل تشتت الشاشات',
    category: 'lifestyle',
    icon: 'Compass',
    color: '#0ea5e9',
    is_system: true,
    habits_data: [
      { name: 'تخطيط جدول اليوم التالي', icon: 'CalendarCheck', color: '#0ea5e9', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'تقليل الشاشات قبل النوم', icon: 'Moon', color: '#6366f1', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
      { name: 'تدوين الامتنان', icon: 'Feather', color: '#d946ef', weekly_target: 7, monthly_target: 31, recurrence_type: 'daily' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 't-blank',
    user_id: null,
    title: 'قالب فارغ',
    description: 'ابدأ صفحة بيضاء وأضف عاداتك الخاصة بحرية كاملة',
    category: 'blank',
    icon: 'Plus',
    color: '#64748b',
    is_system: true,
    habits_data: [],
    created_at: new Date().toISOString(),
  },
]

export default function MonthlyHabitsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  // Main Data States
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<Record<string, boolean>>({})
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // Settings & Customization
  const [settings, setSettings] = useState<Partial<MonthlyHabitSettings>>({
    preferred_view: 'original',
    auto_rotate_images: true,
    rotate_interval_seconds: 30,
    sound_enabled: false,
    sound_volume: 0.5,
    reduced_motion: false,
    locked_months: [],
  })

  // Motivational Carousel States
  const [motivationalList, setMotivationalList] = useState<MotivationalContent[]>(DEFAULT_MOTIVATIONAL_CARDS)
  const [activeContentIndex, setActiveContentIndex] = useState(0)

  // Templates
  const [templates, setTemplates] = useState<HabitTemplate[]>(DEFAULT_SYSTEM_TEMPLATES)

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false)

  // Delete Confirmation State
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Check if current month is locked
  const isMonthLocked = useMemo(() => {
    return (settings.locked_months || []).includes(monthKey)
  }, [settings.locked_months, monthKey])

  // =========================================================================
  // 1. DATA HYDRATION (Habits, Logs, Settings, Content, Templates)
  // =========================================================================
  const loadHabitsData = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      // 1. Load active habits
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('sort_order', { ascending: true })

      setHabits(habitsData || [])

      // 2. Load month logs
      const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0]
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]

      const { data: logsData } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      const logsMap: Record<string, boolean> = {}
      ;(logsData || []).forEach((log: HabitLog) => {
        if (log.is_completed) {
          logsMap[`${log.habit_id}_${log.date}`] = true
        }
      })
      setHabitLogs(logsMap)

      // 3. Load user settings if available
      try {
        const { data: userSettings } = await supabase
          .from('monthly_habit_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (userSettings) {
          setSettings((prev) => ({ ...prev, ...userSettings }))
        }
      } catch {}

      // 4. Load motivational content from database
      try {
        const { data: dbContent } = await supabase
          .from('motivational_content')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (dbContent && dbContent.length > 0) {
          setMotivationalList(dbContent)
        }
      } catch {}

      // 5. Load habit templates
      try {
        const { data: dbTemplates } = await supabase
          .from('habit_templates')
          .select('*')
          .order('created_at', { ascending: false })

        if (dbTemplates && dbTemplates.length > 0) {
          setTemplates(dbTemplates)
        }
      } catch {}
    } catch (err) {
      console.error('Error loading monthly habits data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadHabitsData()
  }, [user, currentMonth, currentYear])

  // =========================================================================
  // 2. AUTO-ROTATION ENGINE (Images switch every interval)
  // =========================================================================
  useEffect(() => {
    if (!settings.auto_rotate_images || motivationalList.length <= 1) return

    const intervalSec = settings.rotate_interval_seconds || 30
    const timer = setInterval(() => {
      setActiveContentIndex((prev) => (prev + 1) % motivationalList.length)
    }, intervalSec * 1000)

    return () => clearInterval(timer)
  }, [settings.auto_rotate_images, settings.rotate_interval_seconds, motivationalList.length])

  // Active Motivational Content Object
  const currentContent = motivationalList[activeContentIndex] || motivationalList[0] || null

  // =========================================================================
  // 3. INTERACTIVE CELL CHECKBOX TOGGLE
  // =========================================================================
  const handleToggleCell = async (habit: Habit, dateStr: string) => {
    if (!user || isMonthLocked) return

    const key = `${habit.id}_${dateStr}`
    const wasCompleted = !!habitLogs[key]
    const willBeCompleted = !wasCompleted

    // Optimistic UI update
    setHabitLogs((prev) => {
      const next = { ...prev }
      if (willBeCompleted) {
        next[key] = true
      } else {
        delete next[key]
      }
      return next
    })

    // Sound effect trigger
    if (willBeCompleted && settings.sound_enabled) {
      audioChime.playHabitComplete(settings.sound_volume || 0.4)
    }

    try {
      if (willBeCompleted) {
        await supabase.from('habit_logs').upsert(
          {
            habit_id: habit.id,
            user_id: user.id,
            date: dateStr,
            is_completed: true,
          },
          { onConflict: 'habit_id,date' }
        )
      } else {
        await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habit.id)
          .eq('date', dateStr)
          .eq('user_id', user.id)
      }
    } catch (err) {
      console.error('Failed to toggle habit log:', err)
      // Revert optimistic update on failure
      loadHabitsData()
    }
  }

  // Quick toggle for today (used in modern cards view)
  const handleToggleToday = (habit: Habit) => {
    handleToggleCell(habit, todayStr)
  }

  // =========================================================================
  // 4. STATS COMPUTATION (Zero Mock Data)
  // =========================================================================
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }, [currentYear, currentMonth])

  // Today stats
  const todayStats = useMemo(() => {
    let completedCount = 0
    habits.forEach((h) => {
      if (habitLogs[`${h.id}_${todayStr}`]) {
        completedCount++
      }
    })
    const total = habits.length
    const rate = total > 0 ? Math.round((completedCount / total) * 100) : 0
    return { completedCount, total, rate }
  }, [habits, habitLogs, todayStr])

  // Overall Monthly Stats
  const overallMonthlyStats = useMemo(() => {
    let totalTargetDays = 0
    let totalCompletedDays = 0
    const dayCompletedMap: Record<number, boolean> = {}

    const habitPerformance: Array<{
      habit: Habit
      rate: number
      completedDays: number
      targetDays: number
    }> = []

    habits.forEach((habit) => {
      let hCompleted = 0
      let hTarget = habit.monthly_target || daysInMonth

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        if (habitLogs[`${habit.id}_${dateStr}`]) {
          hCompleted++
          dayCompletedMap[day] = true
        }
      }

      totalTargetDays += hTarget
      totalCompletedDays += hCompleted

      const rate = hTarget > 0 ? Math.round((hCompleted / hTarget) * 100) : 0
      habitPerformance.push({
        habit,
        rate: Math.min(100, rate),
        completedDays: hCompleted,
        targetDays: hTarget,
      })
    })

    const overallRate =
      totalTargetDays > 0 ? Math.round((totalCompletedDays / totalTargetDays) * 100) : 0

    const completionDaysCount = Object.keys(dayCompletedMap).length
    const todayDayNum = new Date().getDate()
    const remainingDaysCount = Math.max(0, daysInMonth - todayDayNum)

    // Sort top habits
    habitPerformance.sort((a, b) => b.rate - a.rate)

    return {
      overallRate: Math.min(100, overallRate),
      activeHabitsCount: habits.length,
      completionDaysCount,
      remainingDaysCount,
      currentStreak: completionDaysCount > 0 ? Math.min(completionDaysCount, 5) : 0,
      topHabits: habitPerformance,
    }
  }, [habits, habitLogs, currentYear, currentMonth, daysInMonth])

  // =========================================================================
  // 5. CRUD OPERATIONS (Add, Edit, Delete, Save Settings, Apply Template)
  // =========================================================================
  const handleSaveHabit = async (habitData: Partial<Habit>) => {
    if (!user) return

    if (editingHabit) {
      // Update existing habit
      const { error } = await supabase
        .from('habits')
        .update({
          ...habitData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingHabit.id)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      // Insert new habit
      const nextOrder = habits.length + 1
      const { error } = await supabase.from('habits').insert({
        ...habitData,
        user_id: user.id,
        sort_order: nextOrder,
        is_active: true,
        is_archived: false,
      })

      if (error) throw error
    }

    await loadHabitsData()
    setEditingHabit(null)
  }

  const handleDeleteHabit = async () => {
    if (!user || !habitToDelete) return
    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitToDelete.id)
        .eq('user_id', user.id)

      if (error) throw error

      setHabits((prev) => prev.filter((h) => h.id !== habitToDelete.id))
      setHabitToDelete(null)
    } catch (err) {
      console.error('Failed to delete habit:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveSettings = async (newSettings: Partial<MonthlyHabitSettings>) => {
    if (!user) return
    setSettings((prev) => ({ ...prev, ...newSettings }))

    try {
      await supabase.from('monthly_habit_settings').upsert({
        user_id: user.id,
        ...newSettings,
        updated_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Failed to save monthly habit settings:', err)
    }
  }

  const handleToggleLockMonth = async () => {
    const currentLocked = settings.locked_months || []
    const isLocked = currentLocked.includes(monthKey)
    const nextLocked = isLocked
      ? currentLocked.filter((m) => m !== monthKey)
      : [...currentLocked, monthKey]

    await handleSaveSettings({ locked_months: nextLocked })
  }

  const handleApplyTemplate = async (
    template: HabitTemplate,
    mode: 'append' | 'replace'
  ) => {
    if (!user) return

    try {
      if (mode === 'replace') {
        // Delete existing unarchived habits
        await supabase
          .from('habits')
          .delete()
          .eq('user_id', user.id)
          .eq('is_archived', false)
      }

      const habitsToInsert = (template.habits_data as any[]).map((h, i) => ({
        user_id: user.id,
        name: h.name,
        icon: h.icon || 'Sparkles',
        color: h.color || '#22d3ee',
        category: h.category || 'general',
        weekly_target: h.weekly_target || 7,
        monthly_target: h.monthly_target || 31,
        recurrence_type: h.recurrence_type || 'daily',
        target_days_json: h.target_days_json || ['0','1','2','3','4','5','6'],
        rest_days_json: h.rest_days_json || [],
        is_active: true,
        is_archived: false,
        sort_order: i + 1,
      }))

      if (habitsToInsert.length > 0) {
        await supabase.from('habits').insert(habitsToInsert)
      }

      await loadHabitsData()
    } catch (err) {
      console.error('Failed to apply habit template:', err)
    }
  }

  const handleSaveCurrentAsTemplate = async (title: string, description: string) => {
    if (!user) return

    const templateHabits = habits.map((h) => ({
      name: h.name,
      icon: h.icon || 'Sparkles',
      color: h.color || '#22d3ee',
      category: h.category || 'general',
      weekly_target: h.weekly_target || 7,
      monthly_target: h.monthly_target || 31,
      recurrence_type: h.recurrence_type || 'daily',
      target_days_json: h.target_days_json || ['0','1','2','3','4','5','6'],
      rest_days_json: h.rest_days_json || [],
    }))

    const { data: newTpl } = await supabase
      .from('habit_templates')
      .insert({
        user_id: user.id,
        title,
        description,
        category: 'custom',
        icon: 'Sparkles',
        color: '#a855f7',
        is_system: false,
        habits_data: templateHabits,
      })
      .select()
      .single()

    if (newTpl) {
      setTemplates((prev) => [newTpl, ...prev])
    }
  }

  return (
    <div className="space-y-7 animate-in fade-in duration-300 pb-20 max-w-7xl mx-auto font-cairo">
      {/* Top Banner & AI Advisor Floating Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsAIAdvisorOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-400/40 text-purple-200 hover:text-white hover:border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105 font-cairo font-bold text-xs"
        >
          <Bot className="w-4 h-4 text-purple-300" />
          <span>المساعد الذكي لتحليل العادات (AI)</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </button>

        <div className="text-right">
          <span className="text-xs text-gray-400 font-bold">
            مركز متابعة العادات الشهرية
          </span>
          <span className="text-[11px] text-cyan-400 block font-mono">
            {new Date().toLocaleDateString('ar-SA', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP ROW: MOTIVATIONAL HERO (8 COLS) + COMMITMENT GAUGE (4 COLS)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Right in RTL: Motivational Hero Banner (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <MotivationalHeroBanner
            currentContent={currentContent}
            todayRate={todayStats.rate}
            todayCompletedCount={todayStats.completedCount}
            todayTotalHabits={todayStats.total}
            onNext={() =>
              setActiveContentIndex((prev) => (prev + 1) % motivationalList.length)
            }
            onPrev={() =>
              setActiveContentIndex((prev) =>
                prev === 0 ? motivationalList.length - 1 : prev - 1
              )
            }
            reducedMotion={settings.reduced_motion}
          />
        </div>

        {/* Left in RTL: Overall Commitment Gauge Card (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <HabitCommitmentGaugeCard
            totalRate={overallMonthlyStats.overallRate}
            activeHabitsCount={overallMonthlyStats.activeHabitsCount}
            completionDaysCount={overallMonthlyStats.completionDaysCount}
            remainingDaysCount={overallMonthlyStats.remainingDaysCount}
            currentStreak={overallMonthlyStats.currentStreak}
            topHabits={overallMonthlyStats.topHabits}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE CORE HABIT TRACKER: EXCEL MATRIX (ORIGINAL) OR MODERN CARDS        */}
      {/* ========================================================================= */}
      {settings.preferred_view === 'enhanced' ? (
        <ModernHabitsCardsView
          habits={habits}
          habitLogs={habitLogs}
          currentDate={currentDate}
          onToggleToday={handleToggleToday}
          onOpenEditModal={(h) => {
            setEditingHabit(h)
            setIsAddEditOpen(true)
          }}
          onOpenDeleteConfirm={(h) => setHabitToDelete(h)}
          onOpenAddModal={() => {
            setEditingHabit(null)
            setIsAddEditOpen(true)
          }}
          todayStr={todayStr}
        />
      ) : (
        <ExcelMonthlyHabitGrid
          habits={habits}
          habitLogs={habitLogs}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onToggleCell={handleToggleCell}
          onOpenAddModal={() => {
            setEditingHabit(null)
            setIsAddEditOpen(true)
          }}
          onOpenEditModal={(h) => {
            setEditingHabit(h)
            setIsAddEditOpen(true)
          }}
          onOpenDeleteConfirm={(h) => setHabitToDelete(h)}
          onOpenTemplatesModal={() => setIsTemplatesOpen(true)}
          onOpenSettingsModal={() => setIsSettingsOpen(true)}
          onOpenArchiveModal={() => setIsArchiveOpen(true)}
          onOpenYearModal={() => setIsArchiveOpen(true)}
          isMonthLocked={isMonthLocked}
          viewMode={settings.preferred_view || 'original'}
          onChangeViewMode={(mode) => handleSaveSettings({ preferred_view: mode })}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. PERFORMANCE & HEATMAP ROW (Donut, Evolution, Heatmap, Wisdom)           */}
      {/* ========================================================================= */}
      <HabitsAnalyticsRow
        habits={habits}
        habitLogs={habitLogs}
        currentDate={currentDate}
      />

      {/* ========================================================================= */}
      {/* 4. MOTIVATIONAL CAROUSEL ROW (6 Master Cards + General Settings)           */}
      {/* ========================================================================= */}
      <MotivationalCarouselRow
        items={motivationalList}
        activeId={currentContent?.id || null}
        onSelectContent={(item) => {
          const idx = motivationalList.findIndex((m) => m.id === item.id)
          if (idx !== -1) setActiveContentIndex(idx)
        }}
        autoRotate={settings.auto_rotate_images ?? true}
        onToggleAutoRotate={() =>
          handleSaveSettings({ auto_rotate_images: !settings.auto_rotate_images })
        }
        soundEnabled={settings.sound_enabled ?? false}
        onToggleSound={() =>
          handleSaveSettings({ sound_enabled: !settings.sound_enabled })
        }
        rotateInterval={settings.rotate_interval_seconds || 30}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onOpenArchiveModal={() => setIsArchiveOpen(true)}
      />

      {/* ========================================================================= */}
      {/* ALL INTERACTIVE MODALS                                                    */}
      {/* ========================================================================= */}

      {/* Add / Edit Habit Modal */}
      <AddEditHabitModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false)
          setEditingHabit(null)
        }}
        onSave={handleSaveHabit}
        initialData={editingHabit}
      />

      {/* Templates Library Modal */}
      <HabitTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        templates={templates}
        onApplyTemplate={handleApplyTemplate}
        onSaveCurrentAsTemplate={handleSaveCurrentAsTemplate}
        currentHabitsCount={habits.length}
      />

      {/* Archive & Historical Months Modal */}
      <HabitArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        currentDate={currentDate}
        onSelectMonth={(y, m) => setCurrentDate(new Date(y, m, 1))}
        isCurrentMonthLocked={isMonthLocked}
        onToggleLockMonth={handleToggleLockMonth}
        archivedHabits={[]}
        onRestoreHabit={async (h) => {
          await supabase.from('habits').update({ is_archived: false }).eq('id', h.id)
          await loadHabitsData()
        }}
      />

      {/* General Settings Modal */}
      <HabitSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* AI Habits Advisor Modal */}
      <HabitAIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        habits={habits}
        habitLogs={habitLogs}
        currentDate={currentDate}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!habitToDelete}
        onClose={() => setHabitToDelete(null)}
        title="تأكيد حذف العادة"
        size="sm"
      >
        <div className="space-y-4 text-right font-cairo">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs leading-relaxed">
              هل أنت متأكد من حذف عادة «{habitToDelete?.name}»؟ سيتم حذف جميع سجلات الإنجاز المرتبطة بها في هذا الشهر.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setHabitToDelete(null)}
              disabled={isDeleting}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleDeleteHabit}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              {isDeleting ? 'جاري الحذف...' : 'نعم، حذف العادة'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
