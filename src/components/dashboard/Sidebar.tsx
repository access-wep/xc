'use client'

import React from 'react'
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
  X,
  PlusCircle,
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, profile, isAdmin, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    {
      title: 'الرئيسية (المركز الفضائي)',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'جدول اليوم التفصيلي',
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
      title: 'التحليلات ومعدل الطاقة',
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
      {/* Backdrop for all screen sizes */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        />
      )}

      {/* Sliding HUD Navigation Drawer */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 start-0 z-50 w-80 bg-slate-950/95 backdrop-blur-2xl border-s border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col transition-transform duration-300 ease-in-out text-white',
          isOpen ? 'translate-x-0' : 'translate-x-full rtl:translate-x-full'
        )}
      >
        {/* Brand / Logo + Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <span className="font-black text-lg text-slate-950">ف</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-white leading-tight font-cairo">
                فكرتو
              </span>
              <span className="text-[10px] text-cyan-300 font-bold tracking-wider">
                إدارة المهام المكانية
              </span>
            </div>
          </Link>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-slate-900/70 border border-white/10 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-cyan-500/20 flex-shrink-0">
              {profile?.full_name ? profile.full_name.slice(0, 2) : 'ف'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate font-cairo">
                {profile?.full_name || user?.email?.split('@')[0] || 'المستخدم'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-cyan-300 font-medium truncate font-cairo">
                  {isAdmin ? 'مدير النظام' : 'عضو مفعل'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
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
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all group cursor-pointer font-cairo',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:scale-110',
                      isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-cyan-400'
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold font-mono',
                      isActive
                        ? 'bg-slate-950/30 text-slate-950'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Admin link */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all font-cairo mt-3"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>لوحة الإدارة المركزية</span>
            </Link>
          )}
        </div>

        {/* Quick Action: New Schedule */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/dashboard/schedules"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] font-cairo"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء جدول جديد</span>
          </Link>
        </div>

        {/* Footer controls: Logout */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors font-bold font-cairo"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
          <span className="text-[11px] text-slate-500 font-mono">Fekrto v2.0</span>
        </div>
      </aside>
    </>
  )
}
