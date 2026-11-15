'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CurrencySelector } from '@/components/CurrencySelector'
import { Bell, Menu, Calendar as CalendarIcon, Sparkles } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { profile, user } = useAuth()

  // Arabic formatted current date
  const todayArabic = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="h-16 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Right side in RTL: Menu toggle + Logo & Date */}
      <div className="flex items-center gap-3.5">
        {/* Mobile & Desktop Menu Toggle Button */}
        <button
          onClick={onMenuClick}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] cursor-pointer font-cairo hover:scale-105 active:scale-95"
          aria-label="القائمة السريعة"
        >
          <Menu className="w-4 h-4 text-cyan-400" />
          <span>القائمة</span>
        </button>

        {title ? (
          <h1 className="text-base sm:text-lg font-black text-white font-cairo">
            {title}
          </h1>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-medium">
            <CalendarIcon className="w-4 h-4 text-cyan-400" />
            <span>{todayArabic}</span>
          </div>
        )}
      </div>

      {/* Left side in RTL: Currency & User profile */}
      <div className="flex items-center gap-3">
        {/* Country & Currency Switcher */}
        <CurrencySelector compact />

        {/* Notifications button */}
        <button
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
          aria-label="التنبيهات"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        </button>

        {/* User preview */}
        <div className="flex items-center gap-2.5 ps-2 border-s border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-cyan-500/20">
            {profile?.full_name ? profile.full_name.slice(0, 2) : 'ف'}
          </div>
          <span className="hidden md:inline-block text-xs sm:text-sm font-bold text-white font-cairo">
            {profile?.full_name?.split(' ')[0] || 'المستخدم'}
          </span>
        </div>
      </div>
    </header>
  )
}
