'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

// Icons as SVG components
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  )
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

const features = [
  {
    icon: CalendarIcon,
    title: 'جداول مخصصة',
    description: 'أنشئ جداول يومية أو أسبوعية أو شهرية أو سنوية حسب احتياجاتك الخاصة.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: ClockIcon,
    title: 'إدارة دقيقة للوقت',
    description: 'حدد أوقات البداية والنهاية لكل مهمة وتابع تقدمك لحظة بلحظة.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: ChartIcon,
    title: 'إحصائيات تفصيلية',
    description: 'تابع إنجازاتك اليومية والأسبوعية والشهرية مع رسوم بيانية تفاعلية.',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: ShieldIcon,
    title: 'آمن وموثوق',
    description: 'بياناتك محمية بأعلى معايير الأمان مع تشفير متقدم.',
    gradient: 'from-amber-500 to-orange-600',
  },
]

const steps = [
  {
    number: '01',
    title: 'أنشئ حسابك',
    description: 'سجّل مجانًا في ثوانٍ وابدأ رحلتك نحو الإنتاجية.',
  },
  {
    number: '02',
    title: 'أنشئ جدولك',
    description: 'اختر نوع الجدول المناسب وأضف مهامك بسهولة.',
  },
  {
    number: '03',
    title: 'تابع إنجازاتك',
    description: 'راقب تقدمك وحقق أهدافك يومًا بعد يوم.',
  },
]

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                فكرتو
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                المميزات
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                كيف يعمل
              </a>
              <a href="#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                الأسعار
              </a>
              <Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                الأسئلة الشائعة
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                aria-label="تبديل الوضع"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              <Link
                href="/auth/login"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2"
              >
                دخول
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-gradient-to-l from-indigo-600 to-indigo-500 text-white px-5 py-2 rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                ابدأ مجانًا
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-pulse-soft" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-pulse-soft" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 animate-fade-in">
            <SparklesIcon className="w-4 h-4" />
            <span>منصة متكاملة لتنظيم الوقت والمهام</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6 animate-slide-up text-balance">
            نظّم وقتك،
            <br />
            <span className="gradient-text">حقق أهدافك</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up text-balance" style={{ animationDelay: '0.1s' }}>
            أنشئ جداول مخصصة، تابع مهامك اليومية، وراقب إنجازاتك مع إحصائيات تفصيلية تساعدك على تحقيق أقصى إنتاجية.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-gradient-to-l from-indigo-600 to-indigo-500 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
            >
              ابدأ الآن مجانًا
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 px-8 py-3.5 rounded-xl text-base font-medium border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              تعرّف على المميزات
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">+1000</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">مستخدم نشط</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">+50K</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">مهمة مكتملة</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">98%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">رضا المستخدمين</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              أدوات قوية ومرنة تساعدك على تنظيم يومك وتحقيق أهدافك بكفاءة عالية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              كيف يعمل فكرتو؟
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              ثلاث خطوات بسيطة لبدء رحلتك نحو الإنتاجية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -left-4 w-8 h-0.5 bg-gradient-to-l from-indigo-300 to-transparent dark:from-indigo-700" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold gradient-text">{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              خطط أسعار مرنة
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              اختر الخطة المناسبة لاحتياجاتك
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">الاشتراك الشهري</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">مرونة كاملة بدون التزام طويل</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">29</span>
                <span className="text-lg text-gray-500 dark:text-gray-400 mr-1">ر.س/شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['جداول غير محدودة', 'مهام غير محدودة', 'إحصائيات تفصيلية', 'تقويم تفاعلي', 'دعم فني'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block text-center w-full py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                ابدأ الآن
              </Link>
            </div>

            {/* Yearly Plan */}
            <div className="relative bg-gradient-to-b from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/25">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                وفّر 40%
              </div>
              <h3 className="text-lg font-semibold mb-2">الاشتراك السنوي</h3>
              <p className="text-sm text-indigo-200 mb-6">أفضل قيمة مقابل المال</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">199</span>
                <span className="text-lg text-indigo-200 mr-1">ر.س/سنة</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['كل مميزات الاشتراك الشهري', 'أولوية في الدعم الفني', 'ميزات حصرية مبكرة', 'تقارير متقدمة', 'خصم 40% مقارنة بالشهري'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-indigo-100">
                    <CheckCircleIcon className="w-5 h-5 text-indigo-300 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block text-center w-full py-3 rounded-xl bg-white text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
              >
                ابدأ الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-l from-indigo-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
              جاهز لتنظيم حياتك؟
            </h2>
            <p className="text-lg text-indigo-100 mb-8 relative z-10">
              انضم إلى آلاف المستخدمين الذين يحققون أهدافهم يوميًا مع فكرتو
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-xl text-base font-medium hover:bg-indigo-50 transition-all relative z-10 active:scale-[0.98]"
            >
              ابدأ مجانًا الآن
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">فكرتو</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                منصة احترافية لتنظيم الوقت والمهام وتحقيق الأهداف.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">المنصة</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">المميزات</a></li>
                <li><a href="#pricing" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">الأسعار</a></li>
                <li><Link href="/faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">الشركة</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">القانونية</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">شروط الاستخدام</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/refund-policy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">سياسة الاسترداد</Link></li>
                <li><Link href="/disclaimer" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">إخلاء المسؤولية</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} فكرتو. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
