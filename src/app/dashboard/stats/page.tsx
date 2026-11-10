'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { ProductivityAnalyticsView } from '@/components/dashboard/ProductivityAnalyticsView'
import { StreakCalendarView } from '@/components/dashboard/StreakCalendarView'
import { calculateAnalytics, calculateStreakStats, type AnalyticsSummary, type StreakStats } from '@/lib/productivity'
import type { Task, ScheduleDay, TaskCategory } from '@/types/database'
import { BarChart3, Flame, TrendingUp, Sparkles, RefreshCw } from 'lucide-react'

export default function StatisticsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'analytics' | 'streaks'>('analytics')
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null)

  const loadData = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      // 1. Fetch user tasks
      const { data: tasksData, error: tErr } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

      if (tErr) throw tErr
      const tasks: Task[] = tasksData || []

      // 2. Fetch user schedule days
      const { data: daysData, error: dErr } = await supabase
        .from('schedule_days')
        .select('*, schedules!inner(user_id)')
        .eq('schedules.user_id', user.id)
        .order('date', { ascending: true })

      if (dErr) throw dErr
      const days: ScheduleDay[] = daysData || []

      // 3. Fetch user categories
      const { data: catsData } = await supabase
        .from('task_categories')
        .select('*')
        .eq('user_id', user.id)
      const categories: TaskCategory[] = catsData || []

      // 4. Map tasks to days
      const tasksByDayId: Record<string, Task[]> = {}
      tasks.forEach((t) => {
        if (!tasksByDayId[t.schedule_day_id]) {
          tasksByDayId[t.schedule_day_id] = []
        }
        tasksByDayId[t.schedule_day_id].push(t)
      })

      const daysWithTasks = days.map((d) => ({
        ...d,
        tasks: tasksByDayId[d.id] || [],
      }))

      // 5. Compute Real Analytics and Streaks
      const computedAnalytics = calculateAnalytics(tasks, days, categories)
      const computedStreaks = calculateStreakStats(daysWithTasks, new Date())

      setAnalytics(computedAnalytics)
      setStreakStats(computedStreaks)
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  return (
    <div className="space-y-6">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>تحليل الأداء والإحصائيات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('streaks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'streaks'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>سلسلة الالتزام (Streaks)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="self-end sm:self-auto px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium">جاري احتساب مؤشرات الأداء الحقيقية...</p>
        </div>
      ) : activeTab === 'analytics' && analytics ? (
        <ProductivityAnalyticsView analytics={analytics} />
      ) : activeTab === 'streaks' && streakStats ? (
        <StreakCalendarView stats={streakStats} />
      ) : null}
    </div>
  )
}
