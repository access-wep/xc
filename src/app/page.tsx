'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CurrencySelector } from '@/components/CurrencySelector'
import {
  Calendar,
  Clock,
  BarChart3,
  Flame,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  ChevronDown,
  Layers,
  Heart,
  Check,
  CreditCard,
  Building2,
  Wallet,
  ArrowRight,
} from 'lucide-react'

// Demo interactive task type
interface DemoTask {
  id: string
  title: string
  time: string
  priority: 'عالية' | 'عاجلة' | 'متوسطة' | 'شخصية'
  completed: boolean
  tag: string
}

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const { currentCountry, formatPrice } = useCurrency()

  const [isYearly, setIsYearly] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Interactive Live Demo Tasks
  const [demoTasks, setDemoTasks] = useState<DemoTask[]>([
    {
      id: '1',
      title: 'صلاة الفجر وورد الصباح وجلسة تخطيط اليوم',
      time: '05:30 ص',
      priority: 'عالية',
      completed: true,
      tag: 'عادات وروتين',
    },
    {
      id: '2',
      title: 'جلسة تركيز عميق 90 دقيقة: إنجاز تقرير المشروع النهائي',
      time: '09:00 ص',
      priority: 'عاجلة',
      completed: true,
      tag: 'عمل',
    },
    {
      id: '3',
      title: 'اجتماع فريق العمل لمراجعة مؤشرات الأداء الأسبوعية',
      time: '01:30 م',
      priority: 'متوسطة',
      completed: false,
      tag: 'اجتماعات',
    },
    {
      id: '4',
      title: 'ممارسة الرياضة 45 دقيقة وقضاء وقت عائلي ممتع',
      time: '05:30 م',
      priority: 'شخصية',
      completed: false,
      tag: 'صحة وحياة',
    },
  ])

  const toggleDemoTask = (id: string) => {
    setDemoTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const completedCount = demoTasks.filter((t) => t.completed).length
  const completionRate = Math.round((completedCount / demoTasks.length) * 100)

  // FAQs tailored to real Arab users
  const faqs = [
    {
      q: 'هل المنصة متاحة في جميع الدول العربية وبأسعار مناسبة؟',
      a: `نعم، "فكرتو" صُممت خصيصاً لتغطي كافة أنحاء الوطن العربي (22 دولة). نقوم تلقائياً بضبط العملة والأسعار لتناسب القوة الشرائية في كل دولة، مع إمكانية التبديل اليدوي بين العملات في أي لحظة.`,
    },
    {
      q: 'كيف يعمل نظام الدفع المحلي والتحويلات اليدوية؟',
      a: `نوفر طرق الدفع المألوفة والمريحة في كل دولة عربية؛ مثل إنستاباي وفودافون كاش في مصر، مدى وSTC Pay في السعودية، كي نت في الكويت، بنفت باي في البحرين، كليك في الأردن، والتحويلات البنكية المباشرة. تقوم فقط بإرفاق صورة إيصال التحويل، ويقوم فريق الإدارة بمراجعته وتفعيل اشتراكك فورياً.`,
    },
    {
      q: 'هل هناك التزام أو تجديد إجباري للاشتراك؟',
      a: 'لا توجد أي اشتراكات خفية أو خصومات تلقائية مفاجئة. نظام الدفع اليدوي يمنحك السيطرة الكاملة لتجديد اشتراكك متى شئت وبكل راحة بال.',
    },
    {
      q: 'هل يدعم الموقع الهواتف الذكية والأجهزة اللوحية؟',
      a: 'نعم، تم بناء واجهة فكرتو بالكامل لتكون متجاوبة وخفيفة وسريعة على كافة الشاشات، سواء كنت تتصفح من الهاتف الذكي، الآيباد، أو شاشة الحاسوب.',
    },
    {
      q: 'ما الذي يميز فكرتو عن برامج تنظيم المهام الأجنبية المعقدة؟',
      a: 'البرامج الأجنبية غالباً ما تكون مزدحمة ومعقدة ومصممة بثقافة عمل مختلفة. فكرتو تتميز بواجهة عربية أصيلة وهادئة، تراعي إيقاع اليوم العربي (أوقات الصلوات، أسبوع العمل من الأحد للخميس، والتركيز على الإنجاز الفعلي بدل مجرد تدوين المهام).',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-emerald-900/90 text-emerald-100 text-xs py-2 px-4 text-center border-b border-emerald-800/60 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
          جديد الوطن العربي 🌍
        </span>
        <span>
          دعم كامل لكافة الدول العربية مع العملات المحلية وطرق الدفع المفضلة لديك ({currentCountry.flag} {currentCountry.shortName}: {currentCountry.currencyName})
        </span>
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  فكرتو
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 font-medium tracking-wide">
                  Fekrto • تنظيم الوقت العربي
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-7">
              <a
                href="#demo"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                التجربة الحية
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                لماذا فكرتو؟
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                الأسعار بالعملة المحلية
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                تجارب المستخدمين
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                الأسئلة الشائعة
              </a>
            </div>

            {/* Actions & Currency Selector */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Country & Currency Switcher */}
              <CurrencySelector />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="تبديل الوضع"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Auth links */}
              <Link
                href="/auth/login"
                className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                دخول
              </Link>
              <Link
                href="/auth/register"
                className="text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-emerald-600/20 active:scale-95"
              >
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION (Natural, warm, human-crafted) */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle geometric backdrop */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-200/60 to-teal-200/40 dark:from-emerald-950/40 dark:to-teal-900/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>المنصة الأولى المصممة لإيقاع اليوم العربي</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-normal">| 22 دولة عربية</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.25] sm:leading-[1.2] mb-6">
            نظّم يومك ومهامك بوعي وإتقان،
            <br />
            <span className="bg-gradient-to-l from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              وعِش إنتاجية حقيقية خالية من الفوضى
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            تخلص من تشتت التطبيقات المعقدة وقوائم المهام المهملة. صممنا <strong className="font-semibold text-slate-900 dark:text-white">فكرتو</strong> لرواد الأعمال، المستقلين، والمهنيين في العالم العربي ليمنحك جدولاً يومياً واضحاً ومتابعة إنجاز حقيقية حتى نهاية يومك.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-98"
            >
              <span>ابدأ تنظيم يومك مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3.5 rounded-xl text-base font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>جرّب التفاعل الحي بالأسفل</span>
            </a>
          </div>

          {/* Value Props Strip */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-2">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>لا يتطلب بطاقة بنكية للبدء</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>طرق دفع محلية في {currentCountry.shortName} ({currentCountry.currencySymbol})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>خصوصية تامة وتشفير لقاعدة بياناتك</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE LIVE PRODUCT DEMO (Organic, real, touchable) */}
      <section id="demo" className="py-12 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              تجربة حية فورية
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              كيف يبدو يومك داخل فكرتو؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              (جرّب الضغط على المهام بنفسك لمشاهدة تحديث نسبة إنجاز اليوم لحظياً!)
            </p>
          </div>

          {/* Interactive Mock Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
            {/* Header of Mock */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/70 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    جدول اليوم: خطة التركيز والإنتاجية
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  الأحد • 4 مهام مجدولة • نظام صارم لإغلاق اليوم
                </p>
              </div>

              {/* Live Completion Badge */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium">نسبة الإنجاز</div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {completionRate}%
                  </div>
                </div>
                <div className="w-12 h-12 relative flex items-center justify-center">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      className="text-slate-100 dark:text-slate-700"
                      fill="transparent"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      className="text-emerald-500 transition-all duration-500 ease-out"
                      fill="transparent"
                      strokeDasharray="100"
                      strokeDashoffset={100 - completionRate}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[10px] font-bold absolute text-slate-700 dark:text-slate-200">
                    {completedCount}/{demoTasks.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Task list with live interactive clicks */}
            <div className="p-4 sm:p-6 space-y-2.5">
              {demoTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleDemoTask(task.id)}
                  className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    task.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 text-slate-500 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {task.completed ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : null}
                    </button>
                    <div>
                      <div
                        className={`text-sm font-medium transition-all ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {task.time}
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                          {task.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Tag */}
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      task.priority === 'عاجلة'
                        ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                        : task.priority === 'عالية'
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                        : task.priority === 'متوسطة'
                        ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                        : 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>

            {/* Motivational Footer */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <Flame className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                سلسلة الالتزام: 12 يوماً متتالياً 🔥
              </span>
              <span className="text-slate-400">قاعدة فكرتو: إغلاق 100% يعني إتقان اليوم</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARAB PAYMENT METHODS STRIP */}
      <section className="py-10 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                وسائل دفع محلية موثوقة
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                ادفع بالعملة والوسيلة المتاحة في بلدك العربي
              </h3>
            </div>

            {/* Badges of Arab Payment gateways */}
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
                { name: 'Apple Pay', flag: '🌐' },
                { name: 'تحويل بنكي مباشر', flag: '🏦' },
              ].map((method, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <span className="text-xs">{method.flag}</span>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES (Concrete solutions to real daily problems) */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              بساطة مطلقة • بدون تعقيد
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              كل ما تحتاجه لإنجاز مهامك براحة وتركيز
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
              لم نبنِ مجرد قائمة مهام عادية؛ بل نظاماً متكاملاً يساعدك على الانتقال من النية إلى التنفيذ الفعلي كل صباح.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                جداول مرنة تناسب نمط حياتك
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                أنشئ جداول يومية أو أسبوعية أو شهرية أو مخصصة. تدعم أسبوع العمل العربي وتراعي توازنك بين العمل، العائلة، وحياتك الشخصية.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                سلسلة الالتزام (Streaks) لليوم الكامل
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                لا نمنحك إنجاز اليوم إلا إذا أتممت 100% من مهامك الفعلية. هذا النظام الصارم يحفزك نفسياً على عدم تأجيل المهام ويصنع عادات لا تنكسر.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                إحصائيات واضحة ومباشرة
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                اعرف أين تذهب ساعات يومك. تقارير أسبوعية وشهرية توضح معدل إنجازك الفعلي، الأيام الأكثر إنتاجية، ونقاط التحسين.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                سريع ومتوافق مع الهاتف والحاسوب
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                تصفح سلس وسريع جداً على شاشات الجوال بدون تطبيقات ثقيلة أو استهلاك للبطارية. بياناتك متزامنة لحظياً على كل أجهزتك.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                دفع يدوي شفاف بدون خصم تلقائي
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                لا نربط بطاقتك بخصم شهري إجباري مفاجئ. ادفع بالطريقة المحلية المفضلة لديك وارفع الإيصال ليتم تفعيل حسابك مباشرة.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                أمان كامل وخصوصية فائقة
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                مهامك ومعلوماتك الشخصية محمية بسياسات أمان صارمة (RLS). لا نشارك أي بيانات ولا نضع إعلانات مزعجة أبداً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC MULTI-CURRENCY PRICING SECTION */}
      <section id="pricing" className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              أسعار عادلة للوطن العربي
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              استثمر في إنتاجيتك واستعد وقتك
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base">
              الأسعار معروضة تلقائياً بـ{' '}
              <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                {currentCountry.currencyName} ({currentCountry.flag} {currentCountry.shortName})
              </strong>
              . يمكنك تغيير الدولة من الزاوية العلوية متى شئت.
            </p>

            {/* Billing Toggle (Monthly / Yearly) */}
            <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  !isYearly
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                اشتراك شهري
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`relative px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isYearly
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                اشتراك سنوي
                <span className="absolute -top-2.5 -left-2 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                  وفر 40%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Card */}
            <div
              className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border transition-all ${
                !isYearly
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">الخطة الشهرية</h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  مرونة كاملة
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                مناسبة للبدء وتجربة النظام بدون التزام طويل الأمد.
              </p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {formatPrice(currentCountry.monthlyPrice)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ شهرياً</span>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>جداول مهام غير محدودة (يومي، أسبوعي، شهري)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>تتبع سلسلة الاستمرارية ومعدل الإنجاز اليومي</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>تقارير ورسوم بيانية أسبوعية للأداء</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>دعم طرق الدفع المحلية في {currentCountry.shortName}</span>
                </li>
              </ul>

              <Link
                href="/auth/register"
                className="w-full block text-center py-3 rounded-xl border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold transition-all"
              >
                ابدأ باشتراك شهري
              </Link>
            </div>

            {/* Yearly Card (Featured) */}
            <div
              className={`relative bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-emerald-700/60 shadow-2xl transition-all ${
                isYearly ? 'ring-2 ring-emerald-400' : ''
              }`}
            >
              <div className="absolute -top-3.5 right-8 bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>الخيار الأكثر شعبية في الوطن العربي</span>
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="text-xl font-bold text-white">الخطة السنوية</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  وفر 40%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                أفضل استثمار لعام كامل من الالتزام والإنتاجية العالية.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {formatPrice(currentCountry.yearlyPrice)}
                  </span>
                  <span className="text-xs text-slate-300">/ سنوياً</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  (يعادل تقريباً {formatPrice(Math.round(currentCountry.yearlyPrice / 12))} شهرياً فقط!)
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>كافة مميزات الاشتراك الشهري بالكامل</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>توفير يعادل ما يقارب 5 أشهر مجانية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>أولوية التفعيل الفوري لإيصال التحويل</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>أولوية قصوى في الدعم الفني والميزات الجديدة</span>
                </li>
              </ul>

              <Link
                href="/auth/register"
                className="w-full block text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/25 active:scale-98"
              >
                اختر الخطة السنوية الآن
              </Link>
            </div>
          </div>

          {/* Local Country Help Box */}
          <div className="mt-10 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentCountry.flag}</span>
              <div>
                <strong className="text-slate-900 dark:text-white block">
                  طرق الدفع المتاحة في {currentCountry.name}:
                </strong>
                <span className="text-slate-500 dark:text-slate-400">
                  {currentCountry.paymentMethods.join(' • ')}
                </span>
              </div>
            </div>
            <Link
              href="/auth/register"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>سجل حسابك للدفع المحلي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (Authentic Arab Voices from Real Arab Cities) */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              قصص نجاح من قلب العالم العربي
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              ماذا يقول مستخدمو فكرتو؟
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
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
                  'غيّرت فكرتو طريقة تخطيطي لأسبوع العمل تماماً. الواجهة سريعة، بدون بهرجة مزعجة، والدفع عبر مدى وSTC Pay سهل جداً.',
              },
              {
                name: 'سلمى الشناوي',
                role: 'مديرة تسويق ومستشارة نمو',
                city: 'القاهرة، مصر 🇪🇬',
                quote:
                  'كنت مشتتة بين 3 تطبيقات أجنبية. ميزة نسبة إنجاز اليوم وسلسلة الاستمرارية خلتني أركز على إتمام المهام الفعلية بدل كتابتها فقط. والدفع بإنستاباي كان سريعاً.',
              },
              {
                name: 'عمر المنصوري',
                role: 'مدير مشاريع ريادية',
                city: 'دبي، الإمارات 🇦🇪',
                quote:
                  'التصميم الهادئ والخط العربي الواضح يعطيك راحة نفسية أثناء العمل. أفضل استثمار سنوي قمت به هذا العام.',
              },
              {
                name: 'د. يوسف التازي',
                role: 'كاتب ومصمم منتجات رقمية',
                city: 'الدار البيضاء، المغرب 🇲🇦',
                quote:
                  'فخور بوجود منصة عربية بهذه الجودة العالية. لا تشعر أنها قالب جاهز، بل منتج صُمم بعناية لاحتياجاتنا الحقيقية.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  "{item.quote}"
                </p>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.role}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                    {item.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION (Real Answers) */}
      <section id="faq" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              إجابات واضحة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              الأسئلة الشائعة
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-right font-semibold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 mr-3 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-tr from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-10 sm:p-14 border border-emerald-800/50 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
                ابدأ رحلة الإنجاز اليوم
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                توقف عن تأجيل أهدافك وابدأ بتنظيم يومك الآن
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-8">
                انضم إلى نخبة من المهنيين العرب الذين حوّلوا ساعات يومهم إلى إنجازات ملموسة وراحة بال حقيقية.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
              >
                <span>إنشاء حسابك مجاناً</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER (With country flags and legal links) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-slate-900 dark:text-white">فكرتو</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-4">
                منصة عربية رائدة لتنظيم الوقت والمهام اليومية وفق أعلى معايير الجودة والخصوصية، مع دعم كامل لكافة دول الوطن العربي.
              </p>
              <div className="flex items-center gap-2">
                <CurrencySelector />
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">المنصة</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><a href="#demo" className="hover:text-emerald-600 transition-colors">التجربة التفاعلية</a></li>
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">المميزات</a></li>
                <li><a href="#pricing" className="hover:text-emerald-600 transition-colors">الأسعار والعملات</a></li>
                <li><a href="#testimonials" className="hover:text-emerald-600 transition-colors">تجارب المستخدمين</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">عن فكرتو</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><Link href="/about" className="hover:text-emerald-600 transition-colors">من نحن</Link></li>
                <li><Link href="/faq" className="hover:text-emerald-600 transition-colors">الأسئلة الشائعة</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">الشروط والقانونية</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">شروط الاستخدام</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/refund-policy" className="hover:text-emerald-600 transition-colors">سياسة الاسترجاع</Link></li>
                <li><Link href="/disclaimer" className="hover:text-emerald-600 transition-colors">إخلاء المسؤولية</Link></li>
              </ul>
            </div>
          </div>

          {/* Arab Countries Flags Bar */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div className="text-center sm:text-right">
              © {new Date().getFullYear()} فكرتو (Fekrto). صُنع بكل إتقان للمستخدم العربي في كافة الأقطار العربية ❤️
            </div>
            <div className="flex items-center gap-1.5 text-base" title="نخدم كافة الدول العربية">
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
    </div>
  )
}
