'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Input, Badge } from '@/components/ui'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const supabase = createClient()

  // Profile Edit State
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Password Change State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsUpdatingProfile(true)
    setProfileMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      await refreshProfile()
      setProfileMessage({
        type: 'success',
        text: 'تم تحديث بياناتك الشخصية بنجاح!',
      })
    } catch (err: any) {
      setProfileMessage({
        type: 'error',
        text: err.message || 'حدث خطأ أثناء تحديث الملف الشخصي.',
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: 'error',
        text: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: 'كلمة المرور وتأكيدها غير متطابقين.',
      })
      return
    }

    setIsUpdatingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      setPasswordMessage({
        type: 'success',
        text: 'تم تغيير كلمة المرور بنجاح!',
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordMessage({
        type: 'error',
        text: err.message || 'تعذر تغيير كلمة المرور.',
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          <span>الملف الشخصي وإعدادات الحساب</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          إدارة بياناتك الشخصية، معلومات الاتصال، وأمان حسابك
        </p>
      </div>

      {/* Account Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            {profile?.full_name ? profile.full_name.slice(0, 2) : 'ف'}
          </div>
          <div className="text-center sm:text-start flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile?.full_name || 'المستخدم'}
              </h2>
              <Badge variant="success">حساب موثق</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {profile?.email}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 justify-center sm:justify-start">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                العمر: {profile?.age || 18} عامًا (مؤهل)
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                الحالة: نشط
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Information */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          تعديل البيانات الشخصية
        </h3>

        {profileMessage && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              profileMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
            }`}
          >
            {profileMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{profileMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="الاسم الكامل"
            icon={<User className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="البريد الإلكتروني (غير قابل للتعديل)"
              disabled
              value={profile?.email || ''}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 50 000 0000"
              icon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={isUpdatingProfile}>
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          تغيير كلمة المرور
        </h3>

        {passwordMessage && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              passwordMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
            }`}
          >
            {passwordMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{passwordMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="outline"
              isLoading={isUpdatingPassword}
            >
              تحديث كلمة المرور
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
