'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CurrencySelector } from '@/components/CurrencySelector'
import {
  Sparkles,
  Check,
  CheckCircle2,
  Flame,
  ArrowLeft,
  Shield,
  Layers,
  Zap,
  Clock,
  Calendar,
  BarChart3,
  ChevronDown,
  LogOut,
  Smartphone,
  Wallet,
  ShieldCheck,
  Target,
  Rocket,
  Compass,
} from 'lucide-react'

export default function FekrtoLanding() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const { currentCountry, formatPrice } = useCurrency()

  const [focusMode, setFocusMode] = useState(false)
  const [selectedDayIdx, setSelectedDayIdx] = useState(3) // Default: الأربعاء 23
  const [isYearly, setIsYearly] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Interactive Live Demo Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'مراجعة العروض التسويقية وجلسة التخطيط', completed: true, priority: 'عالية', time: '09:00 ص' },
    { id: 2, title: 'إعداد تقرير المشروع النهائي ومؤشرات الأداء', completed: false, priority: 'عاجلة', time: '11:30 ص' },
    { id: 3, title: 'إنجاز مهام العميل ومراجعة الجداول', completed: true, priority: 'مستمرة', time: '02:00 م' },
    { id: 4, title: 'جلسة تركيز عميق: القراءة والتعلم الذاتي', completed: false, priority: 'شخصية', time: '06:00 م' },
  ])

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = Math.round((completedCount / tasks.length) * 100)

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const daysList = [
    { label: 'الأحد', date: '20' },
    { label: 'الإثنين', date: '21' },
    { label: 'الثلاثاء', date: '22' },
    { label: 'الأربعاء', date: '23' },
    { label: 'الخميس', date: '24' },
    { label: 'الجمعة', date: '25' },
    { label: 'السبت', date: '26' },
  ]

  // FAQs
  const faqs = [
    {
      q: 'هل المنصة متاحة في جميع الدول العربية وبأسعار مناسبة؟',
      a: `نعم، "فكرتو" صُممت خصيصاً لتغطي كافة أنحاء الوطن العربي (22 دولة). نقوم تلقائياً بضبط العملة والأسعار لتناسب القوة الشرائية في كل دولة، مع إمكانية التبديل اليدوي بين العملات في أي لحظة.`,
    },
    {
      q: 'كيف يعمل نظام الدفع المحلي والتحويلات اليدوية؟',
      a: `نوفر طرق الدفع المألوفة والمريحة في كل دولة عربية؛ مثل إنستاباي وفودافون كاش في مصر، مدى وSTC Pay في السعودية، كي نت في الكويت، بنفت باي في البحرين، كليك في الأردن، والتحويلات البنكية المباشرة. تقوم فقط برفع صورة إيصال التحويل، ويقوم فريق الإدارة بمراجعته وتفعيل اشتراكك فورياً.`,
    },
    {
      q: 'هل هناك التزام أو تجديد إجباري للاشتراك؟',
      a: 'لا توجد أي اشتراكات خفية أو خصومات تلقائية مفاجئة. نظام الدفع اليدوي يمنحك السيطرة الكاملة لتجديد اشتراكك متى شئت وبكل راحة بال.',
    },
    {
      q: 'ما هو "وضع التركيز" وإدارة المهام المكانية ثلاثية الأبعاد؟',
      a: 'هو نظام بصري تفاعلي يركز طاقتك الذهنية على المهام الحالية فقط مع حجب المشتتات، ومتابعة مدارات طاقتك ونسبة إنجازك اليومية في بيئة عمل ثلاثية الأبعاد مصممة بعناية.',
    },
    {
      q: 'هل يدعم الموقع الهواتف الذكية والأجهزة اللوحية؟',
      a: 'نعم، تم بناء واجهة فكرتو بالكامل لتكون متجاوبة وخفيفة وسريعة على كافة الشاشات، سواء كنت تتصفح من الهاتف الذكي، الآيباد، أو شاشة الحاسوب.',
    },
  ]

  return (
    <main className="relative min-h-screen bg-[#020617] text-white overflow-hidden font-sans rtl selection:bg-cyan-500 selection:text-slate-950">
      {/* ========================================================================= */}
      {/* 1. الخلفية الكونية الحية (Cosmic Nebula & Neural Glow)                    */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(15,23,42,0.85),rgba(2,6,23,1))] z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. الـ Navbar العلوي الزجاجي العائم                                       */}
      {/* ========================================================================= */}
      <div className="sticky top-4 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
        <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-2xl bg-slate-950/70 border border-white/10 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
          {/* الشعار */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl text-slate-950">ف</span>
            </div>
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent font-cairo">
              فكرتو
            </span>
          </Link>

          {/* روابط التصفح */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              الرئيسية
            </a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              لماذا فكرتو؟
            </a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">
              الباقات والعملات
            </a>
            <a href="#testimonials" className="hover:text-cyan-400 transition-colors">
              آراء المستخدمين
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              الأسئلة الشائعة
            </a>
          </div>

          {/* الأزرار وتحديد العملة */}
          <div className="flex items-center gap-3">
            {/* اختيار الدولة والعملة */}
            <CurrencySelector />

            {/* حالة تسجيل الدخول */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-all font-cairo"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>لوحة الإدارة</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center gap-2 font-cairo"
                >
                  <Layers className="w-4 h-4" />
                  <span>لوحة التحكم</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  دخول
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all font-cairo"
                >
                  ابدأ مجاناً
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 3. محتوى الـ Hero والمركز الهولوجرامي المكاني ثلاثي الأبعاد                 */}
      {/* ========================================================================= */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 sm:px-8 mx-auto max-w-7xl py-14 sm:py-20">
        {/* الجانب الأيمن: النصوص التسويقية البارزة */}
        <div className="lg:col-span-5 space-y-6 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>جيل جديد من إدارة المهام المكانية</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight font-cairo">
            نظم يومك ومهامك{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(34,211,238,0.25)]">
              بوعي وإتقان
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            تخلص من تشتت التطبيقات المعقدة. صممنا <strong className="text-white font-bold">«فكرتو»</strong> لتمتلك جدولاً يومياً واضحاً ومتابعة حقيقية خالية من الفوضى، مصممة لإيقاع اليوم العربي.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={user ? '/dashboard' : '/auth/register'}
              className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-2xl font-black shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-cairo"
            >
              <span>{user ? 'دخول لوحة التحكم' : 'ابدأ رحلتك الآن'}</span>
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>

            {/* زر وضع التركيز التفاعلي */}
            <button
              type="button"
              onClick={() => setFocusMode(!focusMode)}
              className={`px-5 py-3.5 rounded-2xl font-bold transition-all backdrop-blur-xl flex items-center gap-2.5 border text-xs sm:text-sm font-cairo ${
                focusMode
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.35)] scale-105'
                  : 'bg-slate-900/80 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  focusMode ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'
                }`}
              />
              <span>{focusMode ? 'إلغاء وضع التركيز' : 'تفعيل وضع التركيز'}</span>
            </button>
          </div>

          {/* شريط المزايا السريعة */}
          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>بدون بطاقة بنكية للبدء</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>دعم {currentCountry.shortName} ({currentCountry.currencySymbol})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>خصوصية وتشفير كامل</span>
            </div>
          </div>
        </div>

        {/* الجانب الأيسر: مركز القيادة الهولوجرامي (3D Spatial Glassmorphism UI) */}
        <div className="lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`p-6 sm:p-8 rounded-3xl bg-slate-900/50 border backdrop-blur-2xl shadow-2xl relative overflow-hidden group transition-all duration-500 ${
              focusMode
                ? 'border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.3)] ring-2 ring-cyan-400/40'
                : 'border-white/15'
            }`}
          >
            {/* تأثير إضاءة تفاعلية خلف الكارت */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all pointer-events-none" />

            {/* تقويم الأسبوع الهولوجرامي */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="font-black text-base sm:text-lg text-white font-cairo">
                  المخطط الأسبوعي التفاعلي
                </h3>
              </div>

              {/* شريط الأيام السبعة */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {daysList.map((day, idx) => {
                  const isSelected = selectedDayIdx === idx
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDayIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-cairo ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      {day.label} {day.date}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* محتوى المهام وشريط الإنجاز الدائري المجسم */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* شريط التقدم الدائري */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-white/10 shadow-inner">
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
                      className="text-cyan-400 fill-none transition-all duration-700 ease-out"
                      strokeDasharray={301.59}
                      strokeDashoffset={301.59 * (1 - progress / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-white font-cairo tracking-tight">
                      {progress}%
                    </span>
                    <span className="text-[10px] text-cyan-300 font-bold -mt-1 font-mono">
                      {completedCount}/{tasks.length}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-300 font-bold mt-3 font-cairo">
                  إجمالي إنجاز اليوم
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  (اضغط على المهام لتحديث النسبة)
                </span>
              </div>

              {/* قائمة المهام التفاعلية */}
              <div className="md:col-span-8 space-y-2.5">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.015 }}
                    onClick={() => toggleTask(task.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                      task.completed
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-slate-400 shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                        : 'bg-slate-950/50 border-white/10 hover:border-white/20 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors flex-shrink-0 ${
                          task.completed
                            ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                            : 'border-slate-600 bg-slate-900/60'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-bold block truncate font-cairo ${
                            task.completed ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {task.time}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border font-cairo whitespace-nowrap ${
                        task.priority === 'عاجلة'
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : task.priority === 'عالية'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : task.priority === 'مستمرة'
                          ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                          : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* شريط الإحصائية التحفيزية السفلي للكارت */}
            <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold font-cairo">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                سلسلة الالتزام: 12 يوماً متتالياً 🔥
              </span>
              <span className="text-slate-400 text-[11px] font-cairo">
                إغلاق 100% يعني إتقان اليوم
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. كروت المميزات الرئيسية الثلاثة (Spatial Glass Cards)                    */}
      {/* ========================================================================= */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-cairo">
            بساطة مطلقة • بدون تعقيد
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 font-cairo">
            ثلاث ركائز تبني يومك الناجح
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            صُممت كل ميزة لمساعدتك على الانتقال من فوضى الأفكار إلى هدوء الإنجاز الفعلي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'إدارة مهام سهلة',
              desc: 'أنشئ مهامك، صنفها بأولويات مرئية، وابدأ إنجازها ببساطة وسلاسة دون تعقيدات البرامج الأجنبية.',
              icon: '🎯',
              glow: 'cyan',
            },
            {
              title: 'تنظيم ذكي للوقت',
              desc: 'جدولك اليومي والأسبوعي في مكان واحد متناسق مع أوقات الصلاة واليوم العربي مع تنبيهات دقيقة.',
              icon: '⏰',
              glow: 'indigo',
            },
            {
              title: 'تحقيق أهدافك واستمراريتك',
              desc: 'حول طموحاتك إلى خطة واضحة وتابع مدارات طاقتك وسلسلة التزامك يوماً بعد يوم لتحقيق قفزات حقيقية.',
              icon: '🚀',
              glow: 'emerald',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-7 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-2xl shadow-xl hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-2 text-white font-cairo">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. شريط بوابات الدفع المحلية في الوطن العربي                               */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-10 border-y border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-cairo">
                طرق دفع محلية مألوفة 🌍
              </span>
              <h3 className="text-base font-black text-white mt-0.5 font-cairo">
                ادفع بالعملة والوسيلة المعتمدة في بلدك العربي بكل سهولة
              </h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              {[
                { name: 'مدى (Mada)', flag: '🇸🇦' },
                { name: 'إنستاباي (InstaPay)', flag: '🇪🇬' },
                { name: 'فودافون كاش', flag: '🇪🇬' },
                { name: 'STC Pay', flag: '🇸🇦' },
                { name: 'كي نت (KNET)', flag: '🇰🇼' },
                { name: 'بنفت باي (Benefit)', flag: '🇧🇭' },
                { name: 'كليك (CliQ)', flag: '🇯🇴' },
                { name: 'بريدي موب', flag: '🇩🇿' },
                { name: 'تحويل بنكي مباشر', flag: '🏦' },
              ].map((method, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 font-bold font-cairo shadow-sm"
                >
                  <span className="text-sm">{method.flag}</span>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. باقات الأسعار المخصصة للوطن العربي (Multi-Currency Pricing)               */}
      {/* ========================================================================= */}
      <section id="pricing" className="relative z-10 py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-cairo">
            أسعار عادلة للوطن العربي
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 font-cairo">
            استثمر في إنتاجيتك واستعد وقتك
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            الأسعار معروضة تلقائياً بـ{' '}
            <strong className="text-cyan-300 font-bold">
              {currentCountry.currencyName} ({currentCountry.flag} {currentCountry.shortName})
            </strong>
            . يمكنك تغيير الدولة من الزاوية العلوية متى شئت.
          </p>

          {/* محول الاشتراك السنوي / الشهري */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/80 border border-white/15 backdrop-blur-xl shadow-lg">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-cairo ${
                !isYearly
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              اشتراك شهري
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`relative px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-cairo ${
                isYearly
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              اشتراك سنوي
              <span className="absolute -top-2.5 -left-2 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md font-mono">
                وفر 40%
              </span>
            </button>
          </div>
        </div>

        {/* كروت الأسعار الزجاجية المكانية */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* كارت الاشتراك الشهري */}
          <div
            className={`rounded-3xl p-8 backdrop-blur-2xl transition-all flex flex-col justify-between border ${
              !isYearly
                ? 'bg-slate-900/70 border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/50'
                : 'bg-slate-900/40 border-white/10 shadow-xl'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-white font-cairo">الخطة الشهرية</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10 font-cairo">
                  مرونة كاملة
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium">
                مناسبة للبدء وتجربة النظام بدون التزام طويل الأمد.
              </p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-cairo">
                  {formatPrice(currentCountry.monthlyPrice)}
                </span>
                <span className="text-xs text-slate-400 font-cairo">/ شهرياً</span>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300 font-medium">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>جداول مهام غير محدودة (يومي، أسبوعي، شهري)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>تتبع سلسلة الاستمرارية ونواة الطاقة المكانية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>تقارير ورسوم بيانية أسبوعية للأداء</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>دعم طرق الدفع المحلية في {currentCountry.shortName}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/auth/register"
              className="w-full block text-center py-3.5 rounded-xl border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 font-bold transition-all font-cairo shadow-sm"
            >
              ابدأ باشتراك شهري
            </Link>
          </div>

          {/* كارت الاشتراك السنوي (المميز) */}
          <div
            className={`relative rounded-3xl p-8 backdrop-blur-2xl transition-all flex flex-col justify-between border ${
              isYearly
                ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900/80 to-slate-950 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400/50'
                : 'bg-slate-900/40 border-white/10 shadow-xl'
            }`}
          >
            <div className="absolute -top-3.5 right-8 bg-amber-400 text-slate-950 text-xs font-black px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5 font-cairo">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>الخيار الأكثر شعبية في الوطن العربي</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="text-xl font-black text-white font-cairo">الخطة السنوية</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-cairo">
                  وفر 40%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 font-medium">
                أفضل استثمار لعام كامل من الالتزام والإنتاجية العالية.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-cairo">
                    {formatPrice(currentCountry.yearlyPrice)}
                  </span>
                  <span className="text-xs text-slate-400 font-cairo">/ سنوياً</span>
                </div>
                <div className="text-[11px] text-cyan-400 mt-1 font-mono">
                  (يعادل تقريباً {formatPrice(Math.round(currentCountry.yearlyPrice / 12))} شهرياً فقط!)
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-200 font-medium">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>كافة مميزات الاشتراك الشهري بالكامل</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>توفير يعادل ما يقارب 5 أشهر مجانية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>أولوية التفعيل الفوري لإيصال التحويل</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>أولوية قصوى في الدعم الفني عبر الواتساب</span>
                </li>
              </ul>
            </div>

            <Link
              href="/auth/register"
              className="w-full block text-center py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 font-cairo"
            >
              اختر الخطة السنوية الآن
            </Link>
          </div>
        </div>

        {/* صندوق المساعدة بالدفع المحلي في بلد المستخدم */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-xs sm:text-sm text-slate-300 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentCountry.flag}</span>
            <div>
              <strong className="text-white block font-cairo">
                طرق الدفع المتاحة في {currentCountry.name}:
              </strong>
              <span className="text-slate-400 text-xs">
                {currentCountry.paymentMethods.join(' • ')}
              </span>
            </div>
          </div>
          <Link
            href="/auth/register"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-cairo"
          >
            <span>سجل حسابك للدفع المحلي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. تجارب وآراء المستخدمين (Testimonials)                                    */}
      {/* ========================================================================= */}
      <section id="testimonials" className="relative z-10 py-16 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-cairo">
            قصص نجاح من قلب العالم العربي
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 font-cairo">
            ماذا يقول مستخدمو فكرتو؟
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            تجارب حقيقية لمهنيين ورواد أعمال استعادوا السيطرة على أوقاتهم.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'م. أحمد العتيبي',
              role: 'مؤسس متجر إلكتروني ومطور',
              city: 'الرياض، السعودية 🇸🇦',
              quote:
                'غيّرت فكرتو طريقة تخطيطي لأسبوع العمل تماماً. الواجهة ثلاثية الأبعاد ممتازة، سريعة، والدفع عبر مدى وSTC Pay سلس جداً.',
            },
            {
              name: 'سلمى الشناوي',
              role: 'مديرة تسويق ومستشارة نمو',
              city: 'القاهرة، مصر 🇪🇬',
              quote:
                'كنت مشتتة بين 3 تطبيقات أجنبية. ميزة نسبة إنجاز اليوم وسلسلة الاستمرارية خلتني أركز على إتمام المهام الفعلية بدل كتابتها فقط.',
            },
            {
              name: 'عمر المنصوري',
              role: 'مدير مشاريع ريادية',
              city: 'دبي، الإمارات 🇦🇪',
              quote:
                'التصميم المكاني ثلاثي الأبعاد والخط العربي المريح يعطيك راحة نفسية أثناء العمل. أفضل استثمار سنوي قمت به هذا العام.',
            },
            {
              name: 'د. يوسف التازي',
              role: 'كاتب ومصمم منتجات رقمية',
              city: 'الدار البيضاء، المغرب 🇲🇦',
              quote:
                'فخور بوجود منصة عربية بهذه الجودة العالمية الفائقة. تشعر أنها بنيت بعناية شديدة لاحتياجاتنا وثقافتنا.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-cyan-500/30 transition-all"
            >
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                "{item.quote}"
              </p>
              <div className="border-t border-white/10 pt-4">
                <div className="font-bold text-sm text-white font-cairo">{item.name}</div>
                <div className="text-[11px] text-slate-400">{item.role}</div>
                <div className="text-[11px] text-cyan-400 font-bold mt-0.5">{item.city}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. الأسئلة الشائعة (FAQ Accordion)                                       */}
      {/* ========================================================================= */}
      <section id="faq" className="relative z-10 py-16 px-6 sm:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-cairo">
            إجابات واضحة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 font-cairo">
            الأسئلة الشائعة
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={index}
                className="bg-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden transition-colors shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-right font-bold text-sm sm:text-base text-white cursor-pointer font-cairo"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform duration-200 flex-shrink-0 mr-3 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. بانر الدعوة لاتخاذ القرار (Final Call to Action)                       */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-6 sm:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-tr from-cyan-950/60 via-slate-900/90 to-indigo-950/60 text-white rounded-3xl p-10 sm:p-14 border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] relative overflow-hidden backdrop-blur-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-4 border border-cyan-500/40 font-cairo">
              ابدأ رحلة الإنجاز اليوم
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 font-cairo">
              توقف عن تأجيل أهدافك وابدأ بتنظيم يومك الآن
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 font-medium">
              انضم إلى نخبة من رواد الأعمال والمهنيين العرب الذين حوّلوا ساعات يومهم إلى إنجازات ملموسة وراحة بال حقيقية.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 font-cairo"
            >
              <span>إنشاء حسابك مجاناً</span>
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. الفوتر الزجاجي مع أعلام الدول العربية وروابط المنصة                     */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl py-12 text-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* العمود 1: الشعار والوصف */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-slate-950 font-black">
                  ف
                </div>
                <span className="text-base font-black text-white font-cairo">فكرتو (Fekrto)</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed mb-4 font-medium">
                منصة عربية رائدة لتنظيم الوقت وإدارة المهام المكانية ثلاثية الأبعاد، مع دعم كامل للعملات المحلية في 22 دولة عربية.
              </p>
              <div className="flex items-center gap-2">
                <CurrencySelector />
              </div>
            </div>

            {/* العمود 2: روابط المنصة */}
            <div>
              <h4 className="font-bold text-white mb-3 font-cairo">المنصة</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#features" className="hover:text-cyan-400 transition-colors">
                    المميزات
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                    الأسعار والعملات
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-cyan-400 transition-colors">
                    تجارب المستخدمين
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-cyan-400 transition-colors">
                    الأسئلة الشائعة
                  </a>
                </li>
              </ul>
            </div>

            {/* العمود 3: عن فكرتو */}
            <div>
              <h4 className="font-bold text-white mb-3 font-cairo">عن فكرتو</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-cyan-400 transition-colors">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                    الأسئلة الشائعة
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>

            {/* العمود 4: الشروط القانونية */}
            <div>
              <h4 className="font-bold text-white mb-3 font-cairo">الشروط والقانونية</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                    شروط الاستخدام
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-cyan-400 transition-colors">
                    سياسة الاسترجاع
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-cyan-400 transition-colors">
                    إخلاء المسؤولية
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* شريط أعلام الدول العربية وحقوق النشر */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div className="text-center sm:text-right">
              © {new Date().getFullYear()} فكرتو (Fekrto). صُنع بكل إتقان للمستخدم العربي في كافة الأقطار العربية ❤️
            </div>
            <div className="flex items-center gap-1.5 text-base flex-wrap justify-center" title="نخدم كافة الدول العربية">
              <span>🇸🇦</span>
              <span>🇪🇬</span>
              <span>🇦🇪</span>
              <span>🇰🇼</span>
              <span>🇶🇦</span>
              <span>🇧🇭</span>
              <span>🇴🇲</span>
              <span>🇯🇴</span>
              <span>🇮🇶</span>
              <span>🇲🇦</span>
              <span>🇩🇿</span>
              <span>🇹🇳</span>
              <span>🇱🇾</span>
              <span>🇸🇩</span>
              <span>🇱🇧</span>
              <span>🇵🇸</span>
              <span>🇾🇪</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
