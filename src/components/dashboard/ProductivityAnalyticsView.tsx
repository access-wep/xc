'use client'

import React from 'react'
import type { AnalyticsSummary } from '@/lib/productivity'
import {
  BarChart3,
  TrendingUp,
  Clock,
  PieChart,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'

interface ProductivityAnalyticsViewProps {
  analytics: AnalyticsSummary
}

export function ProductivityAnalyticsView({ analytics }: ProductivityAnalyticsViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>تحليل الأداء</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
            Analytics
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          اعرف أكثر الأيام إنتاجية، وأكثر أنواع المهام إنجازاً وفق بياناتك الفعلية الحية
        </p>
      </div>

      {/* 2. Top Row (3 Widgets) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Widget 1: Best Days of Week */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>أفضل الأيام إنتاجية</span>
            </h3>

            <div className="space-y-3.5">
              {analytics.bestDaysOfWeek.slice(0, 5).map((item) => (
                <div key={item.dayName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.dayName}</span>
                    <span className="font-mono font-bold text-teal-400">{item.rate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-700"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 2: Category Breakdown Donut */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-sky-400" />
            <span>أكثر أنواع المهام إنجازاً</span>
          </h3>

          <div className="flex items-center justify-between gap-4 my-auto">
            {/* Donut circle */}
            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#0284c7"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - (analytics.categoryBreakdown[0]?.percentage || 35) / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-black text-white">
                  {analytics.categoryBreakdown[0]?.percentage || 35}%
                </span>
              </div>
            </div>

            {/* Category breakdown legend */}
            <div className="space-y-2 flex-1 text-xs">
              {analytics.categoryBreakdown.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-400">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 3: Overall Performance Line */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>إجمالي الأداء الأسبوعي</span>
            </h3>

            {/* SVG Trend Line */}
            <div className="h-32 w-full pt-4 flex flex-col justify-end">
              <div className="relative h-20 w-full flex items-end justify-between px-2">
                {analytics.weeklyPerformance.map((wp, i) => (
                  <div key={wp.weekLabel} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-8 rounded-t-lg bg-gradient-to-t from-teal-500/20 to-teal-400 transition-all duration-500 relative group"
                      style={{ height: `${Math.max(15, (wp.rate / 100) * 70)}px` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-teal-300 font-mono">
                        {wp.rate}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {wp.weekLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row (3 Widgets) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Widget 4: Monthly Performance Bar Chart */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>مخطط الإنجاز الشهري</span>
          </h3>

          <div className="h-32 flex items-end justify-between gap-3 px-2">
            {analytics.monthlyPerformance.map((mp) => (
              <div key={mp.monthName} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full max-w-[42px] rounded-t-xl bg-teal-400/90 transition-all duration-700 relative group flex items-start justify-center pt-1"
                  style={{ height: `${Math.max(20, (mp.rate / 100) * 85)}px` }}
                >
                  <span className="text-[10px] font-bold text-slate-950 font-mono">
                    {mp.rate}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {mp.monthName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 5: Priorities Distribution */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>توزيع المهام حسب الأولوية</span>
          </h3>

          <div className="space-y-3.5 my-auto">
            {analytics.priorityDistribution.map((p) => (
              <div key={p.priority} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{p.nameAr}</span>
                  <span className="font-mono font-bold text-slate-400">{p.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${p.percentage}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 6: Productive Time Slots */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>أكثر الأوقات إنتاجية</span>
          </h3>

          <div className="space-y-2.5 my-auto">
            {analytics.productiveTimeSlots.map((slot) => (
              <div
                key={slot.slot}
                className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white" dir="ltr">
                      {slot.slot}
                    </div>
                    <div className="text-[10px] text-slate-500">{slot.label}</div>
                  </div>
                </div>

                <span className="font-mono font-bold text-sm text-teal-400">
                  {slot.rate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
