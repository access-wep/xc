'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CurrencySelector } from '@/components/CurrencySelector'

export default function FekrtoLanding() {
  const { user } = useAuth()
  const { currentCountry, formatPrice } = useCurrency()
  const [progress, setProgress] = useState(78)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'مراجعة العروض التسويقية', completed: true, priority: 'عالية' },
    { id: 2, title: 'إعداد تقرير المشروع', completed: false, priority: 'عاجلة' },
    { id: 3, title: 'إنجاز مهام العميل', completed: true, priority: 'مستمرة' },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    setProgress((prev) => Math.min(100, prev + 5))
  }

  return (
    <main className="relative min-h-screen bg-[#020617] text-white overflow-hidden font-sans rtl selection:bg-cyan-500 selection:text-slate-950">
      {/* خلفية السديم الكوني الحي */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.8),rgba(2,6,23,1))] z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* شريط التنقل العلوي الزجاجي */}
      <nav className="relative z-50 flex items-center justify-between px-6 sm:px-8 py-5 mx-auto max-w-7xl backdrop-blur-xl bg-slate-950/60 border border-white/10 rounded-2xl mt-4 shadow-2xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <span className="font-black text-xl text-slate-950">ف</span>
          </div>
          <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent font-cairo">
            فكرتو
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium font-cairo">
          <Link href="/" className="hover:text-cyan-400 transition-colors">الرئيسية</Link>
          <a href="#features" className="hover:text-cyan-400 transition-colors">لماذا فكرتو؟</a>
          <Link href="/dashboard/subscription" className="hover:text-cyan-400 transition-colors">الباقات</Link>
          <Link href="/faq" className="hover:text-cyan-400 transition-colors">الأسئلة الشائعة</Link>
        </div>
        <div className="flex items-center gap-3">
          <CurrencySelector compact />
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all font-cairo"
            >
              لوحة التحكم
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                دخول
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all font-cairo"
              >
                ابدأ مجاناً
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* القسم الرئيسي (Hero Section) والمركز الهولوجرامي */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 sm:px-8 mx-auto max-w-7xl py-14 sm:py-20">
        <div className="lg:col-span-5 space-y-6 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            المنصة الأولى المصممة لإيقاع اليوم العربي
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-wide font-cairo">
            نظم يومك ومهامك{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              بوعي وإتقان
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            تخلص من تشتت التطبيقات المعقدة وقوائم المهام المهملة. صممنا «فكرتو» لتمتلك جدولاً يومياً واضحاً ومتابعة حقيقية.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Link
              href={user ? '/dashboard' : '/auth/register'}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-2xl font-bold shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-cairo"
            >
              <span>{user ? 'دخول لوحة التحكم' : 'ابدأ رحلتك'}</span>
            </Link>
          </div>
        </div>

        {/* مجسم التقويم الأسبوعي ثلاثي الأبعاد العائم */}
        <div className="lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-white/10">
              <h3 className="font-bold text-lg text-cyan-300 font-cairo">المخطط الأسبوعي التفاعلي</h3>
              <div className="flex gap-2 text-xs text-slate-300 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['الأحد 20', 'الإثنين 21', 'الثلاثاء 22', 'الأربعاء 23', 'الخميس 24', 'الجمعة 25', 'السبت 26'].map((day, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl border font-cairo whitespace-nowrap ${
                      idx === 3
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg'
                        : 'bg-slate-800/50 border-white/5'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-white/10">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-800 fill-none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-cyan-400 fill-none transition-all duration-700"
                      strokeDasharray={301.59}
                      strokeDashoffset={301.59 * (1 - progress / 100)}
                    />
                  </svg>
                  <span className="absolute text-2xl font-extrabold font-cairo">{progress}%</span>
                </div>
                <span className="text-xs text-slate-400 mt-3 font-cairo">إجمالي الإنجاز</span>
              </div>

              <div className="md:col-span-8 space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                      task.completed
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-slate-400'
                        : 'bg-slate-950/40 border-white/10 hover:border-white/20 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                          task.completed
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-black'
                            : 'border-slate-600 bg-slate-900/60'
                        }`}
                      >
                        {task.completed && '✓'}
                      </div>
                      <span
                        className={`text-sm font-medium font-cairo ${
                          task.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-white/5 font-cairo">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* الكروت السفلية */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'إدارة مهام سهلة', desc: 'أنشئ مهامك، صنفها، وابدأ إنجازها ببساطة وسلاسة.', icon: '🎯' },
          { title: 'تنظيم ذكي للوقت', desc: 'جدولك اليومي والأسبوعي في مكان واحد مع تنبيهات دقيقة.', icon: '⏰' },
          { title: 'تحقيق أهدافك', desc: 'حول طموحاتك إلى خطة واضحة وتابع تقدمك خطوة بخطوة.', icon: '🚀' },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white font-cairo">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
