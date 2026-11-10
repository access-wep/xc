'use client'

import React from 'react'
import { Calendar, ChevronRight, ChevronLeft, CalendarDays, LayoutGrid, RotateCcw } from 'lucide-react'

export type ViewMode = 'daily' | 'weekly' | 'monthly'

interface ViewSwitcherProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  currentDate: Date
  onDateChange: (date: Date) => void
  onTodayClick: () => void
}

export function ViewSwitcher({
  currentView,
  onViewChange,
  currentDate,
  onDateChange,
  onTodayClick,
}: ViewSwitcherProps) {
  // Format localized Arabic date
  const formattedDate = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentDate)

  const handlePrev = () => {
    const next = new Date(currentDate)
    if (currentView === 'daily') {
      next.setDate(next.getDate() - 1)
    } else if (currentView === 'weekly') {
      next.setDate(next.getDate() - 7)
    } else {
      next.setMonth(next.getMonth() - 1)
    }
    onDateChange(next)
  }

  const handleNext = () => {
    const next = new Date(currentDate)
    if (currentView === 'daily') {
      next.setDate(next.getDate() + 1)
    } else if (currentView === 'weekly') {
      next.setDate(next.getDate() + 7)
    } else {
      next.setMonth(next.getMonth() + 1)
    }
    onDateChange(next)
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-800 shadow-lg text-white">
      {/* 1. View Mode Toggles */}
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80">
        <button
          type="button"
          onClick={() => onViewChange('daily')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentView === 'daily'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>يومي</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange('weekly')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentView === 'weekly'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>أسبوعي</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange('monthly')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentView === 'monthly'
              ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>شهري</span>
        </button>
      </div>

      {/* 2. Date Navigator */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <button
          type="button"
          onClick={onTodayClick}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          title="الانتقال لليوم"
        >
          <RotateCcw className="w-3 h-3" />
          <span>اليوم</span>
        </button>

        <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="التالي"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs sm:text-sm font-semibold px-2 min-w-[150px] sm:min-w-[180px] text-center text-teal-300">
            {formattedDate}
          </span>

          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="السابق"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
