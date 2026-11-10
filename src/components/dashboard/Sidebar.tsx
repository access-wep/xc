'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck2,
  BarChart3,
  CreditCard,
  User,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, profile, isAdmin, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    {
      title: 'الرئيسية',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'جدول اليوم',
      href: '/dashboard/today',
      icon: CalendarCheck2,
      badge: 'مباشر',
    },
    {
      title: 'إدارة الجداول',
      href: '/dashboard/schedules',
      icon: CalendarDays,
    },
    {
      title: 'متابعة العادات',
      href: '/dashboard/habits',
      icon: Sparkles,
    },
    {
      title: 'القوالب الجاهزة',
      href: '/dashboard/templates',
      icon: PlusCircle,
    },
    {
      title: 'التحليلات والإنجاز',
      href: '/dashboard/stats',
      icon: BarChart3,
    },
    {
      title: 'الاشتراك والباقات',
      href: '/dashboard/subscription',
      icon: CreditCard,
    },
    {
      title: 'الملف الشخصي',
      href: '/dashboard/profile',
      icon: User,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 start-0 z-50 w-72 bg-white dark:bg-gray-900 border-e border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'
        )}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800/60">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                فكرتو
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider">
                إدارة الوقت والمهام
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
              {profile?.full_name ? profile.full_name.slice(0, 2) : 'ف'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'المستخدم'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {isAdmin ? 'مدير النظام' : 'عضو مفعل'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-l from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform group-hover:scale-110',
                      isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Admin link if user is admin */}
          {isAdmin && (
            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>لوحة تحكم الإدارة</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="px-4 py-3">
          <Link
            href="/dashboard/schedules?create=true"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء جدول جديد</span>
          </Link>
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs">نهاري</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="text-xs">ليلي</span>
              </>
            )}
          </button>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 p-2 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs">خروج</span>
          </button>
        </div>
      </aside>
    </>
  )
}
