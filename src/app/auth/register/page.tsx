'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card } from '@/components/ui'
import { Sparkles, Mail, Lock, User, Phone, Calendar, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Age validation: strictly 18 and older
    if (!age || Number(age) < 18) {
      setError('عذرًا، يجب أن يكون عمرك 18 عامًا على الأقل للتسجيل في منصة فكرتو.')
      return
    }

    if (Number(age) > 120) {
      setError('يرجى إدخال عمر صحيح.')
      return
    }

    if (password.length < 8) {
      setError('يجب أن تتكون كلمة المرور من 8 أحرف أو أرقام على الأقل.')
      return
    }

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين.')
      return
    }

    if (!agreeTerms) {
      setError('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.')
      return
    }

    setIsLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
            age: Number(age),
            role: 'user',
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          throw new Error('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.')
        }
        throw new Error(signUpError.message)
      }

      if (data?.user) {
        setSuccess(true)
        // If email confirmation is disabled or session is available, redirect
        if (data.session) {
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 1500)
        }
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    setIsGoogleLoading(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (oauthError) throw oauthError
    } catch (err: any) {
      setError(err.message || 'تعذر التسجيل بواسطة Google')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-l from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            فكرتو
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          إنشاء حساب جديد
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          لديك حساب بالفعل؟{' '}
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline underline-offset-4"
          >
            تسجيل الدخول هنا
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <Card className="p-8 shadow-xl border-gray-100 dark:border-gray-800">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                تم إنشاء الحساب بنجاح!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                أهلاً بك في فكرتو. إذا تطلب تفعيل الحساب بريداً إلكترونياً، يرجى فحص صندوق الوارد لتأكيد حسابك.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                المتابعة إلى تسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Signup Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors shadow-sm mb-6 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isGoogleLoading ? 'جاري التحويل...' : 'التسجيل السريع بواسطة Google'}</span>
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">
                    أو أكمل بيانات التسجيل
                  </span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="الاسم الكامل *"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد"
                  icon={<User className="w-4 h-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="البريد الإلكتروني *"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <Input
                    label="رقم الهاتف"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    icon={<Phone className="w-4 h-4" />}
                  />
                </div>

                {/* Age with strict policy notification */}
                <div>
                  <Input
                    label="العمر (بالسنوات) *"
                    type="number"
                    min="18"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="18 فما فوق"
                    icon={<Calendar className="w-4 h-4" />}
                    hint="يُسمح بالتسجيل لمن بلغ سن 18 عامًا فقط"
                  />
                  {age !== '' && Number(age) < 18 && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">
                      ⚠️ عذرًا، يجب أن يكون عمرك 18 عامًا على الأقل للمتابعة.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="كلمة المرور *"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8 أحرف كحد أدنى"
                    icon={<Lock className="w-4 h-4" />}
                  />

                  <Input
                    label="تأكيد كلمة المرور *"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                  />
                </div>

                {/* Terms and Privacy Checkbox */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    أوافق على{' '}
                    <Link href="/terms" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      شروط الاستخدام
                    </Link>{' '}
                    و{' '}
                    <Link href="/privacy" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      سياسة الخصوصية
                    </Link>{' '}
                    وأؤكد أن عمري 18 عامًا أو أكثر.
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  disabled={age !== '' && Number(age) < 18}
                  className="mt-4"
                >
                  إنشاء الحساب وبدء الاستخدام
                </Button>
              </form>
            </>
          )}
        </Card>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
