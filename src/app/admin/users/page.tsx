'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Input, Badge, Modal } from '@/components/ui'
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  UserX,
  Sparkles,
  Gift,
  Award,
  Crown,
  Check,
} from 'lucide-react'
import type { Profile } from '@/types/database'

export default function AdminUsersPage() {
  const supabase = createClient()

  const [users, setUsers] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [isTogglingRole, setIsTogglingRole] = useState(false)
  const [isGifting, setIsGifting] = useState(false)
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null)

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })

      if (searchTerm.trim()) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query
      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [searchTerm])

  // Toggle user activation (Active / Suspended)
  const handleToggleActive = async (targetUser: Profile) => {
    setIsTogglingStatus(true)
    try {
      const nextActive = !targetUser.is_active
      const { error } = await supabase
        .from('profiles')
        .update({
          is_active: nextActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUser.id)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, is_active: nextActive } : u
        )
      )
      if (selectedUser?.id === targetUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, is_active: nextActive } : null))
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err)
    } finally {
      setIsTogglingStatus(false)
    }
  }

  // Promote / Demote user role (user <-> admin)
  const handleToggleRole = async (targetUser: Profile) => {
    const isCurrentlyAdmin = targetUser.role === 'admin' || targetUser.role === 'super_admin'
    const newRole = isCurrentlyAdmin ? 'user' : 'admin'
    const confirmPrompt = isCurrentlyAdmin
      ? `هل أنت متأكد من سحب صلاحيات الإدارة من ${targetUser.full_name} وإرجاعه لمستخدم عادي؟`
      : `هل أنت متأكد من ترقية ${targetUser.full_name} إلى مشرف (Admin) بكامل صلاحيات الإدارة؟`

    if (!confirm(confirmPrompt)) return

    setIsTogglingRole(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUser.id)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      )
      if (selectedUser?.id === targetUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null))
      }

      setActionSuccessMessage(
        newRole === 'admin'
          ? `تم ترقية ${targetUser.full_name} إلى مشرف بنجاح!`
          : `تم تحويل ${targetUser.full_name} إلى مستخدم عادي بنجاح!`
      )
      setTimeout(() => setActionSuccessMessage(null), 4000)
    } catch (err: any) {
      console.error('Failed to change user role:', err)
      alert(err.message || 'حدث خطأ أثناء تعديل دور المستخدم.')
    } finally {
      setIsTogglingRole(false)
    }
  }

  // Gift Pro Subscription
  const handleGiftSubscription = async (targetUser: Profile, durationMonths: number) => {
    const isYearly = durationMonths >= 12
    const confirmPrompt = `هل تريد إهداء ${targetUser.full_name} اشتراك فكرتو برو (${isYearly ? 'سنة كاملة' : 'شهر واحد'}) مجاناً وتفعيله فوراً؟`
    if (!confirm(confirmPrompt)) return

    setIsGifting(true)
    try {
      const now = new Date()
      const end = new Date(now)
      end.setMonth(end.getMonth() + durationMonths)

      // 1. Deactivate old active subscriptions for this user
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', targetUser.id)
        .eq('status', 'active')

      // 2. Insert new gifted active subscription
      const { error } = await supabase.from('subscriptions').insert({
        user_id: targetUser.id,
        status: 'active',
        is_yearly: isYearly,
        amount_paid: 0,
        start_date: now.toISOString(),
        end_date: end.toISOString(),
      })

      if (error) throw error

      setActionSuccessMessage(
        `تم تفعيل اشتراك برو بنجاح للمستخدم ${targetUser.full_name} لمدة ${isYearly ? 'سنة كاملة' : 'شهر واحد'}!`
      )
      setTimeout(() => setActionSuccessMessage(null), 4000)
    } catch (err: any) {
      console.error('Failed to gift subscription:', err)
      alert(err.message || 'حدث خطأ أثناء إهداء الاشتراك.')
    } finally {
      setIsGifting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Notification Alert */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 underline cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span>إدارة وتدقيق حسابات المستخدمين</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            البحث في قاعدة بيانات المشتركين، تعديل الصلاحيات، إهداء اشتراكات برو، وإدارة حالات الحسابات
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <Input
            placeholder="بحث بالاسم أو البريد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-xs text-gray-500">
            جاري تحميل قائمة المستخدمين...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-500">
            لم يتم العثور على أي مستخدم يطابق معايير البحث.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-end text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-start">المستخدم</th>
                  <th className="py-3 px-4 text-start">العمر</th>
                  <th className="py-3 px-4 text-start">الهاتف</th>
                  <th className="py-3 px-4 text-start">الدور</th>
                  <th className="py-3 px-4 text-start">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {u.full_name}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {u.email}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      {u.age} عامًا
                    </td>

                    <td className="py-3.5 px-4 text-gray-500">
                      {u.phone || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={u.role === 'admin' || u.role === 'super_admin' ? 'warning' : 'default'}>
                        {u.role === 'admin'
                          ? 'مشرف'
                          : u.role === 'super_admin'
                          ? 'مسؤول أعلى'
                          : 'مستخدم'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={u.is_active ? 'success' : 'danger'}>
                        {u.is_active ? 'نشط' : 'موقوف'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(u)}
                        >
                          التفاصيل
                        </Button>
                        <Button
                          variant={u.is_active ? 'danger' : 'secondary'}
                          size="sm"
                          onClick={() => handleToggleActive(u)}
                        >
                          {u.is_active ? 'إيقاف' : 'تفعيل'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="تفاصيل حساب المستخدم"
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-gray-500">معرف المستخدم (UID):</span>
                <span className="font-mono text-[10px]">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الاسم الكامل:</span>
                <span className="font-bold">{selectedUser.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">البريد الإلكتروني:</span>
                <span className="font-mono">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">رقم الهاتف:</span>
                <span>{selectedUser.phone || 'غير مسجل'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">العمر المسجل:</span>
                <span className="font-bold text-emerald-600">{selectedUser.age} عامًا (مستوفٍ لشرط 18+)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">تاريخ التسجيل:</span>
                <span>{new Date(selectedUser.created_at).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>

            {/* Admin Management & Privilege Controls */}
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-indigo-950 dark:text-indigo-200">
                  <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>صلاحيات المشرف والأدوار (Role):</span>
                </div>
                <Badge variant={selectedUser.role === 'admin' || selectedUser.role === 'super_admin' ? 'warning' : 'default'}>
                  {selectedUser.role === 'admin' ? 'مشرف' : selectedUser.role === 'super_admin' ? 'مسؤول أعلى' : 'مستخدم عادي'}
                </Badge>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                ترقية المستخدم لمشرف تمنحه حق الوصول إلى لوحة تحكم الإدارة، مراجعة طلبات الدفع، وإدارة المشتركين والإعدادات.
              </p>

              <div>
                <Button
                  type="button"
                  variant={selectedUser.role === 'admin' ? 'danger' : 'outline'}
                  size="sm"
                  isLoading={isTogglingRole}
                  onClick={() => handleToggleRole(selectedUser)}
                  className="w-full text-xs font-bold gap-1.5"
                >
                  {selectedUser.role === 'admin' ? (
                    <>
                      <UserX className="w-3.5 h-3.5" />
                      <span>سحب صلاحيات الإدارة وإرجاعه لمستخدم عادي</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                      <span>ترقية هذا المستخدم إلى مشرف (Admin)</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Gift Pro Subscription Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>إهداء وتفعيل اشتراك برو فوراً:</span>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                امنح هذا المشترك اشتراك فكرتو برو بكامل المميزات والوصول غير المحدود للعادات والقوالب والتحليلات.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={isGifting}
                  onClick={() => handleGiftSubscription(selectedUser, 1)}
                  className="text-xs gap-1 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span>إهداء شهر برو (30 يوم)</span>
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  isLoading={isGifting}
                  onClick={() => handleGiftSubscription(selectedUser, 12)}
                  className="text-xs gap-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>إهداء سنة كاملة برو</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                إغلاق
              </Button>
              <Button
                variant={selectedUser.is_active ? 'danger' : 'primary'}
                isLoading={isTogglingStatus}
                onClick={() => handleToggleActive(selectedUser)}
              >
                {selectedUser.is_active ? 'تعطيل الحساب' : 'تفعيل الحساب'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
