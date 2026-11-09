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
} from 'lucide-react'
import type { Profile } from '@/types/database'

export default function AdminUsersPage() {
  const supabase = createClient()

  const [users, setUsers] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span>إدارة وتدقيق حسابات المستخدمين</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            البحث في قاعدة بيانات المشتركين، مراجعة الأعمار وتعديل حالات التفعيل
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
