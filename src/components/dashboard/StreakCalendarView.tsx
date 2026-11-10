'use client'

import React from 'react'
import type { StreakStats } from '@/lib/productivity'
import { Flame, Check, Sparkles, Award, TrendingUp } from 'lucide-react'

interface StreakCalendarViewProps {
  stats: StreakStats
  currentDate?: Date
}

export function StreakCalendarView({ stats, currentDate = new Date() }: StreakCalendarViewProps) {
  const monthNameArabic = new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(currentDate)

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>سلسلة الالتزام</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Streaks
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          تابع الأيام المتتالية التي حققت فيها أهدافك بقاعدة إغلاق اليوم بنسبة 100%
        </p>
      </div>

      {/* 2. Top Row: Big Streak Flame Card + Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Big Flame Card (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl flex flex-col justify-between items-center text-center relative overflow-hidden">
          {/* Subtle warm ambient glow */}
          <div className="absolute top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-6 shadow-inner">
            <Flame className="w-12 h-12 fill-amber-500 text-amber-500 animate-pulse" />
          </div>

          <div className="mb-6">
            <div className="text-5xl font-black text-white tracking-tight">
              {stats.currentStreak}
            </div>
            <div className="text-sm font-bold text-slate-400 mt-1">
              {stats.currentStreak === 1 ? 'يوم متتالي' : 'أيام متتالية'}
            </div>
          </div>

          <div className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            {stats.currentStreak > 0
              ? 'ممتاز! استمر في هذا الإيقاع الرائع'
              : 'ابدأ اليوم بإنجاز مهامك لتشغيل عداد الالتزام!'}
          </div>
        </div>

        {/* Calendar Grid Card (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>سلسلة الالتزام – {monthNameArabic}</span>
            </h3>
            <span className="text-[11px] text-teal-400 font-medium">
              قاعدة الـ 100%: فقط الأيام المنجزة بالكامل
            </span>
          </div>

          {/* 7-column Calendar dots matrix */}
          <div className="grid grid-cols-7 gap-3 sm:gap-4 my-auto">
            {stats.calendarDays.map((cd) => {
              const isPastCompleted = cd.isCompleted && !cd.isFuture
              const isToday = cd.isToday

              return (
                <div
                  key={cd.date}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isPastCompleted
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                        : isToday
                        ? 'border-2 border-teal-400 text-teal-300 bg-teal-950/30'
                        : cd.isFuture
                        ? 'border border-slate-800/80 text-slate-600'
                        : 'border border-slate-700/60 text-slate-400 bg-slate-950/20'
                    }`}
                    title={`يوم ${cd.dayNumber} - ${
                      isPastCompleted ? 'يوم مكتمل 100%' : cd.isFuture ? 'يوم قادم' : 'غير مكتمل'
                    }`}
                  >
                    {isPastCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <span>{cd.dayNumber}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-6 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>مكتمل 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-teal-400 bg-teal-950/30 inline-block" />
              <span>اليوم الحالي</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-slate-700 inline-block" />
              <span>لم يكتمل / قادم</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Stats Breakdown + Quote Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Stats Table Card (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl text-white">
          <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>إحصائيات السلسلة</span>
          </h4>

          <div className="divide-y divide-slate-800 text-xs sm:text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">أطول سلسلة</span>
              <span className="font-bold text-amber-400 font-mono text-base">
                {stats.longestStreak} يوم
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">أيام هذا الشهر</span>
              <span className="font-bold text-teal-400 font-mono text-base">
                {stats.daysThisMonth} يوم
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">المتوسط الشهري</span>
              <span className="font-bold text-sky-400 font-mono text-base">
                {stats.monthlyAverage} أيام
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">إجمالي الأيام الناجحة</span>
              <span className="font-bold text-emerald-400 font-mono text-base">
                {stats.totalSuccessfulDays} يوم
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Quote Card with Scenery Styling (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-teal-950 border border-teal-800/40 p-8 shadow-xl flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed max-w-md">
              "الالتزام ليس عملاً واحداً، بل هو سلسلة من القرارات الصغيرة اليومية التي تصنع فرقاً كبيراً في مستقبلك."
            </p>
          </div>

          <div className="relative z-10 pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span className="text-teal-400 font-semibold">فكرتو • Fekrto</span>
            <span>كل يوم خطوة نحو أهدافك الكبرى</span>
          </div>
        </div>
      </div>
    </div>
  )
}
