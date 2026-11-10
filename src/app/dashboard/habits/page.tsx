'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { MonthlyHabitsTrackerView } from '@/components/dashboard/MonthlyHabitsTrackerView'
import type { Habit, HabitLog } from '@/types/database'
import { Sparkles, Target, Flame, Award, ChevronRight, ChevronLeft } from 'lucide-react'

export default function HabitsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<Record<string, boolean>>({})
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const fetchHabitsAndLogs = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      // 1. Fetch habits
      const { data: habitsData, error: hError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true })

      if (hError) throw hError
      setHabits(habitsData || [])

      // 2. Fetch logs for current month
      const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0]
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]

      const { data: logsData, error: lError } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      if (lError) throw lError

      const logsMap: Record<string, boolean> = {}
      ;(logsData || []).forEach((log: HabitLog) => {
        if (log.is_completed) {
          logsMap[`${log.habit_id}_${log.date}`] = true
        }
      })
      setHabitLogs(logsMap)
    } catch (err) {
      console.error('Error fetching habits:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHabitsAndLogs()
  }, [user, currentMonth, currentYear])

  // Toggle habit on a date
  const handleToggleHabitDate = async (habitId: string, dateStr: string) => {
    if (!user) return
    const key = `${habitId}_${dateStr}`
    const currentlyCompleted = !!habitLogs[key]

    // Optimistic UI update
    setHabitLogs((prev) => {
      const next = { ...prev }
      if (currentlyCompleted) {
        delete next[key]
      } else {
        next[key] = true
      }
      return next
    })

    try {
      if (currentlyCompleted) {
        await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habitId)
          .eq('date', dateStr)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('habit_logs')
          .upsert(
            {
              habit_id: habitId,
              user_id: user.id,
              date: dateStr,
              is_completed: true,
            },
            { onConflict: 'habit_id,date' }
          )
      }
    } catch (err) {
      console.error('Error toggling habit date:', err)
      // Rollback
      fetchHabitsAndLogs()
    }
  }

  // Add new habit
  const handleAddHabit = async (habitData: Partial<Habit>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: habitData.name,
          color: habitData.color || '#10b981',
          target_days_per_week: habitData.target_days_per_week || 7,
          sort_order: habits.length,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        setHabits((prev) => [...prev, data])
      }
    } catch (err) {
      console.error('Error adding habit:', err)
    }
  }

  // Delete habit
  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return
    if (!confirm('هل أنت متأكد من حذف هذه العادة؟')) return

    try {
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
      await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id)
    } catch (err) {
      console.error('Error deleting habit:', err)
      fetchHabitsAndLogs()
    }
  }

  const monthNameArabic = new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(currentDate)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            <span>متابعة العادات الشهرية</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ابنِ عادات قوية وثابتة تدعم إنتاجيتك اليومية ونمط حياتك المتوازن
          </p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800 text-white">
          <button
            type="button"
            onClick={() => {
              const prev = new Date(currentDate)
              prev.setMonth(prev.getMonth() - 1)
              setCurrentDate(prev)
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="الشهر السابق"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-2 text-teal-300 min-w-[120px] text-center">
            {monthNameArabic}
          </span>
          <button
            type="button"
            onClick={() => {
              const next = new Date(currentDate)
              next.setMonth(next.getMonth() + 1)
              setCurrentDate(next)
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="الشهر التالي"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Habits Tracker View */}
      <MonthlyHabitsTrackerView
        habits={habits}
        habitLogs={habitLogs}
        currentDate={currentDate}
        onToggleHabitDate={handleToggleHabitDate}
        onAddHabit={handleAddHabit}
        onDeleteHabit={handleDeleteHabit}
      />
    </div>
  )
}
