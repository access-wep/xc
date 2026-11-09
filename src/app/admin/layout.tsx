'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import {
  Shield,
  Users,
  CreditCard,
  FileCheck2,
  Settings,
  FileText,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, isAdmin, isLoading, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Strict server & client admin gate
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login')
      } else if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm font-medium text-gray-500">جاري التحقق من صلاحيات الإدارة...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const navItems = [
    { title: 'نظرة عامة', href: '/admin', icon: LayoutDashboard },
    { title: 'طلبات المدفوعات', href: '/admin/payments', icon: FileCheck2 },
    { title: 'إدارة المستخدمين', href: '/admin/users', icon: Users },
    { title: 'الباقات والأسعار', href: '/admin/subscriptions', icon: CreditCard },
    { title: 'إعدادات وطرق الدفع', href: '/admin/settings', icon: Settings },
    { title: 'الصفحات القانونية', href: '/admin/legal', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-100/70 dark:bg-gray-950 flex flex-col lg:flex-row">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 start-0 z-50 w-72 bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-gray-900 shadow-md">
              <Shield className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-bold text-base text-white">إدارة فكرتو</span>
              <span className="block text-[10px] text-amber-400 font-medium">لوحة التحكم المركزية</span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin info badge */}
        <div className="p-4 mx-4 my-3 rounded-xl bg-gray-800/60 border border-gray-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
            {profile?.full_name?.slice(0, 2) || 'أد'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {profile?.full_name || 'مسؤول النظام'}
            </p>
            <p className="text-[10px] text-amber-400">صلاحيات كاملة (Admin)</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                  isActive
                    ? 'bg-amber-500 text-gray-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}

          <div className="pt-4 mt-4 border-t border-gray-800">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-400 hover:text-indigo-400 hover:bg-gray-800/80 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للوحة المستخدم</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-lg text-xs text-gray-400 hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>المظهر</span>
          </button>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 p-2 rounded-lg text-xs text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:ms-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>لوحة تحكم الإدارة</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>مرحبًا، {profile?.full_name?.split(' ')[0]}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
