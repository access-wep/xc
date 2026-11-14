'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CurrencySelector } from '@/components/CurrencySelector'
import { Bell, Menu, Search, Calendar as CalendarIcon } from 'lucide-react'

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
    <header className="h-16 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/10 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left side (in RTL: right side) */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden cursor-pointer"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title ? (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            <span>{todayArabic}</span>
          </div>
        )}
      </div>

      {/* Right side (in RTL: left side) */}
      <div className="flex items-center gap-3">
        {/* Country & Currency Switcher */}
        <CurrencySelector compact />

        {/* Notifications button */}
        <button
          className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="التنبيهات"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* User preview */}
        <div className="flex items-center gap-2.5 ps-2 border-s border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
            {profile?.full_name ? profile.full_name.slice(0, 2) : 'ف'}
          </div>
          <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
            {profile?.full_name?.split(' ')[0] || 'المستخدم'}
          </span>
        </div>
      </div>
    </header>
  )
}
