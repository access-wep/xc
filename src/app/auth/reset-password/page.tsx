'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card } from '@/components/ui'
import { Sparkles, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('يجب ألا تقل كلمة المرور عن 8 أحرف.')
      return
    }

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين.')
      return
    }

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحديث كلمة المرور.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-950 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-l from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            فكرتو
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          تعيين كلمة مرور جديدة
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          أدخل كلمة المرور الجديدة لحسابك
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 shadow-xl border-gray-100 dark:border-gray-800">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                تم تغيير كلمة المرور بنجاح!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                جاري توجيهك إلى لوحة التحكم...
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="كلمة المرور الجديدة"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                تحديث كلمة المرور
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
