'use client'

import React, { useMemo } from 'react'
import { Modal, Button } from '@/components/ui'
import {
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  Award,
  Target,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react'
import type { Habit } from '@/types/database'

interface HabitAIAdvisorModalProps {
  isOpen: boolean
  onClose: () => void
  habits: Habit[]
  habitLogs: Record<string, boolean>
  currentDate: Date
}

export function HabitAIAdvisorModal({
  isOpen,
  onClose,
  habits,
  habitLogs,
  currentDate,
}: HabitAIAdvisorModalProps) {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Calculate real performance analytics for the AI Advisor
  const insights = useMemo(() => {
    if (habits.length === 0) {
      return {
        topHabit: null,
        slippingHabit: null,
        overallRate: 0,
        recommendations: [
          'ابدأ بإضافة 3 إلى 5 عادات أساسية بسيطة لتثبيت روتينك اليومي دون إرهاق.',
          'اختر قالباً جاهزاً من مكتبة القوالب مثل قالب العادات اليومية أو العبادات.',
        ],
      }
    }

    let totalCompleted = 0
    let totalTarget = 0
    const habitScores: Array<{ habit: Habit; rate: number; count: number }> = []

    habits.forEach((h) => {
      let count = 0
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        if (habitLogs[`${h.id}_${dateStr}`]) count++
      }

      const target = h.monthly_target || daysInMonth
      const rate = target > 0 ? Math.round((count / target) * 100) : 0

      totalCompleted += count
      totalTarget += target
      habitScores.push({ habit: h, rate, count })
    })

    habitScores.sort((a, b) => b.rate - a.rate)
    const topHabit = habitScores[0] || null
    const slippingHabit =
      habitScores.length > 1 ? habitScores[habitScores.length - 1] : null
    const overallRate =
      totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0

    const recommendations: string[] = []
    if (topHabit && topHabit.rate >= 70) {
      recommendations.push(
        `عادة «${topHabit.habit.name}» هي صمام أمان إنتاجيتك بنسبة تحقيق ${topHabit.rate}%، اربط العادات الأخرى بها (Habit Stacking).`
      )
    }
    if (slippingHabit && slippingHabit.rate < 50) {
      recommendations.push(
        `عادة «${slippingHabit.habit.name}» تحتاج إلى تخفيف الحمل قسماً، اجعل هدفها أصغر أو حدد لها وقتاً ثابتاً صباحاً.`
      )
    }
    recommendations.push(
      'تخصيص أيام راحة (Rest Days) يمنع الاحتراق النفسي ويزيد التزامك الأسبوعي.'
    )

    return {
      topHabit,
      slippingHabit,
      overallRate,
      recommendations,
    }
  }, [habits, habitLogs, currentYear, currentMonth, daysInMonth])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="المساعد الذكي لتحليل العادات (FEKRTO AI Advisor)"
      size="lg"
    >
      <div className="space-y-6 text-right font-cairo">
        {/* Header Intro Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">
              تحليل ذكي فوري مبني على إنجازاتك الحقيقية
            </h4>
            <p className="text-[11px] text-gray-400 mt-0.5">
              يقوم المساعد بقراءة سجلات الشهر واكتشاف أنماط تقدمك دون أي تدخل أو تعديل في بياناتك.
            </p>
          </div>
        </div>

        {/* Overall Health Score Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-right space-y-1">
            <span className="text-[11px] text-gray-400">معدل الانضباط العام</span>
            <div className="text-xl font-black text-cyan-300 font-mono">
              {insights.overallRate}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-right space-y-1">
            <span className="text-[11px] text-gray-400">العادة الأكثر ثباتاً</span>
            <div className="text-sm font-bold text-emerald-400 truncate">
              {insights.topHabit ? insights.topHabit.habit.name : '—'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-right space-y-1">
            <span className="text-[11px] text-gray-400">تحتاج لدعم وتركيز</span>
            <div className="text-sm font-bold text-amber-400 truncate">
              {insights.slippingHabit ? insights.slippingHabit.habit.name : '—'}
            </div>
          </div>
        </div>

        {/* Actionable Recommendations List */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
          <h5 className="text-xs font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>توصيات الذكاء الاصطناعي لرفع إنتاجيتك هذا الشهر:</span>
          </h5>

          <ul className="space-y-2 text-xs text-gray-300">
            {insights.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-white/5"
              >
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-white/10">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>
    </Modal>
  )
}
