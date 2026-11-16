'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'
import { Sparkles, Mail, Lock, User, Phone, Calendar, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#020617] text-white relative overflow-hidden font-cairo rtl selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Cosmic Deep Space Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-600/15 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:48px_48px] opacity-15" />
      </div>

      <div className="relative z-10 w-full max-w-lg p-6 sm:p-9 rounded-3xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.8)] space-y-6">
        {/* Brand & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              ف
            </div>
            <span className="text-2xl font-black text-white">فكرتو FEKRTO</span>
          </Link>
          <h2 className="text-2xl font-black text-white">إنشاء حساب جديد</h2>
          <p className="text-xs text-gray-400">
            لديك حساب بالفعل؟{' '}
            <Link
              href="/auth/login"
              className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              تسجيل الدخول هنا
            </Link>
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black text-white">تم إنشاء الحساب بنجاح!</h3>
            <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
              أهلاً بك في فكرتو. إذا تطلب تفعيل الحساب بريداً إلكترونياً، يرجى فحص صندوق الوارد لتأكيد حسابك.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg"
              >
                المتابعة إلى تسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-slate-950/80 hover:bg-slate-900 text-gray-200 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-slate-900 px-3 text-gray-500">أو عبر ملء البيانات</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5 text-right">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">الاسم الكامل</label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد"
                  icon={<User className="w-4 h-4 text-emerald-400" />}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">البريد الإلكتروني</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  icon={<Mail className="w-4 h-4 text-emerald-400" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">العمر (18 سنة فأكثر)</label>
                  <Input
                    type="number"
                    min={18}
                    max={120}
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="25"
                    icon={<Calendar className="w-4 h-4 text-emerald-400" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">رقم الهاتف (اختياري)</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    icon={<Phone className="w-4 h-4 text-emerald-400" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">كلمة المرور</label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-emerald-400" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">تأكيد كلمة المرور</label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-emerald-400" />}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-700 bg-slate-950 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-300 cursor-pointer select-none leading-relaxed">
                  أوافق على{' '}
                  <Link href="/terms" className="text-emerald-400 hover:underline">
                    شروط الاستخدام
                  </Link>{' '}
                  و{' '}
                  <Link href="/privacy" className="text-emerald-400 hover:underline">
                    سياسة الخصوصية
                  </Link>{' '}
                  الخاصة بمنصة فكرتو.
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
                className="mt-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
              >
                إنشاء الحساب
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
