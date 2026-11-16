'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        }
        if (signInError.message.includes('Email not confirmed')) {
          throw new Error('يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل إليك')
        }
        throw new Error(signInError.message)
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
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
      setError(err.message || 'تعذر تسجيل الدخول بواسطة Google')
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

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Right Side: Decorative Motivation Panel (Matching Top-Middle of Mockup) */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/60 to-slate-950/80 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.7)] h-full min-h-[460px] text-right">
          <div className="space-y-4">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                ف
              </div>
              <span className="font-black text-xl text-white">فكرتو FEKRTO</span>
            </Link>

            <div className="pt-8 space-y-2">
              <span className="text-2xl font-black text-white block">أهدافك</span>
              <span className="text-2xl font-black text-emerald-300 block">خططك</span>
              <span className="text-2xl font-black text-cyan-300 block">إنجازاتك</span>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed pt-2">
              تابع نموك اليومي وسلاسل الالتزام الخاصة بك في واجهة ثلاثية الأبعاد تفاعلية.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span>نسبة الجاهزية</span>
              <span className="text-emerald-400 font-mono">100%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full shadow-[0_0_8px_#10b981]" />
            </div>
            <span className="text-[10px] text-gray-500 block text-left">ابدأ الآن...</span>
          </div>
        </div>

        {/* Left Side: The Glassmorphic Auth Form (Matching Mockup) */}
        <div className="md:col-span-7 p-6 sm:p-9 rounded-3xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.8)] space-y-6">
          <div className="text-right space-y-2">
            <div className="md:hidden flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                ف
              </div>
              <span className="font-black text-lg text-white">فكرتو</span>
            </div>
            <h2 className="text-2xl font-black text-white">مرحباً بك مجدداً</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              سعيد بعودتك، لنكمل رحلتك نحو الإنجاز.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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
            <span>{isGoogleLoading ? 'جاري التحويل...' : 'تسجيل الدخول باستخدام Google'}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-900 px-3 text-gray-500">أو عبر البريد الإلكتروني</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 text-right">
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                icon={<Mail className="w-4 h-4 text-emerald-400" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-300">كلمة المرور</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-emerald-400" />}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="mt-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
            >
              تسجيل الدخول
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400">
            <span>ليس لديك حساب؟ </span>
            <Link
              href="/auth/register"
              className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
