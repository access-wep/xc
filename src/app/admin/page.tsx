'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, Badge, Button } from '@/components/ui'
import {
  Users,
  CreditCard,
  FileCheck2,
  DollarSign,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import type { PaymentRequest, Profile } from '@/types/database'

export default function AdminOverviewPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    usersCount: 0,
    pendingPaymentsCount: 0,
    activeSubsCount: 0,
    totalRevenue: 0,
  })
  const [pendingRequests, setPendingRequests] = useState<PaymentRequest[]>([])
  const [recentUsers, setRecentUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadAdminStats = async () => {
    setIsLoading(true)
    try {
      // 1. Total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // 2. Pending payments
      const { count: pendingCount, data: pendingData } = await supabase
        .from('payment_requests')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5)

      // 3. Active subscriptions
      const { count: activeCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // 4. Approved payments sum (revenue)
      const { data: approvedPayments } = await supabase
        .from('payment_requests')
        .select('amount')
        .eq('status', 'approved')

      const revenue = (approvedPayments || []).reduce((acc, p) => acc + (p.amount || 0), 0)

      // 5. Recent registered users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        usersCount: usersCount || 0,
        pendingPaymentsCount: pendingCount || 0,
        activeSubsCount: activeCount || 0,
        totalRevenue: revenue,
      })

      setPendingRequests(pendingData || [])
      setRecentUsers(usersData || [])
    } catch (err) {
      console.error('Error loading admin stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdminStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            لوحة الإحصائيات والإدارة العامة
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            متابعة المشتركين والمدفوعات ومعدلات النمو في منصة فكرتو
          </p>
        </div>

        <Button
          onClick={loadAdminStats}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto"
        >
          تحديث البيانات
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">إجمالي المستخدمين</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {stats.usersCount}
            </h3>
          </div>
        </Card>

        {/* Pending Payments Alert */}
        <Card className="p-5 flex items-center gap-4 border-amber-300 dark:border-amber-700 bg-amber-50/20">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">طلبات دفع معلقة</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-amber-600 mt-0.5">
                {stats.pendingPaymentsCount}
              </h3>
              {stats.pendingPaymentsCount > 0 && (
                <Link
                  href="/admin/payments"
                  className="text-xs text-amber-700 font-bold hover:underline"
                >
                  مراجعة الآن
                </Link>
              )}
            </div>
          </div>
        </Card>

        {/* Active Subscriptions */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">الاشتراكات النشطة</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {stats.activeSubsCount}
            </h3>
          </div>
        </Card>

        {/* Revenue */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">إجمالي الإيرادات</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {stats.totalRevenue.toLocaleString()} <span className="text-xs text-gray-400">ر.س</span>
            </h3>
          </div>
        </Card>
      </div>

      {/* Main Grid: Pending Payment Requests & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payments Table Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-500" />
              <span>طلبات الدفع المعلقة (تتطلب مراجعة)</span>
            </h3>
            <Link
              href="/admin/payments"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-8">
              لا توجد طلبات دفع جديدة بانتظار المراجعة.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      مبلغ: {req.amount} ر.س ({req.is_yearly ? 'سنوي' : 'شهري'})
                    </p>
                    <p className="text-[11px] text-gray-400">
                      التاريخ: {new Date(req.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  <Link
                    href={`/admin/payments?id=${req.id}`}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-gray-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    مراجعة الإيصال
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Registered Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>أحدث المستخدمين المسجلين</span>
            </h3>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>إدارة المستخدمين</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                    {u.full_name?.slice(0, 2) || 'م'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {u.full_name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {u.email} | العمر: {u.age}
                    </p>
                  </div>
                </div>

                <Badge variant={u.is_active ? 'success' : 'danger'}>
                  {u.is_active ? 'مفعل' : 'موقوف'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
