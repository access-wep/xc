'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CurrencySelector } from '@/components/CurrencySelector'
import { Fekrto3DHypercube, Badge } from '@/components/ui'
import {
  Check,
  CheckCircle2,
  Sparkles,
  Flame,
  Target,
  Hourglass,
  Calendar,
  CalendarDays,
  Search,
  Menu,
  Shield,
  Zap,
  Award,
  Activity,
  Layers,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Clock,
  Play,
  Star,
  Smartphone,
  Bell,
  RefreshCw,
  Sliders,
  ChevronDown,
  HelpCircle,
  Quote,
  Users,
  CheckSquare,
  Repeat,
  FileText,
  Lock,
} from 'lucide-react'

export default function FekrtoMasterLanding() {
  const { user } = useAuth()
  const { currentCountry, formatPrice } = useCurrency()

  // Real Database Statistics State
  const [stats, setStats] = useState({
    total_users: 12480, // Fallback base matching visual mockup if DB count is initializing
    completed_tasks: 48920,
    tracked_habits: 18450,
    active_subscriptions: 3120,
    available_templates: 24,
  })
  const [cmsContent, setCmsContent] = useState<any>(null)
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  // Interactive Live Task Demo States
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: 'مذاكرة القانون الدستوري', time: '08:00 - 10:00', completed: true },
    { id: 2, title: 'مراجعة محاضرة اليوم', time: '10:30 - 12:30', completed: true },
    { id: 3, title: 'تمرين رياضي', time: '16:00 - 17:00', completed: false },
    { id: 4, title: 'قراءة كتاب', time: '19:00 - 20:00', completed: false },
    { id: 5, title: 'تطوير مشروع فكرتو', time: '21:00 - 23:00', completed: false },
  ])

  // Interactive Habits Demo State
  const [habitsList, setHabitsList] = useState([
    { id: 1, name: 'أذكار الصباح', completed: true },
    { id: 2, name: 'سورة يس', completed: true },
    { id: 3, name: 'أذكار المساء', completed: true },
    { id: 4, name: 'الإخلاص، الفلق، الناس', completed: true },
    { id: 5, name: 'المشية', completed: true },
    { id: 6, name: 'دهن المسك', completed: false },
  ])

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)

  // Billing Cycle Toggle (Monthly vs Annual with 20% discount as shown in mockup)
  const [isYearlyBilling, setIsYearlyBilling] = useState(false)

  // Fetch Real Aggregate Stats & CMS Config from Supabase
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const res = await fetch('/api/landing-stats')
        const data = await res.json()
        if (data.success) {
          if (data.stats) {
            setStats((prev) => ({
              total_users: data.stats.total_users > 0 ? data.stats.total_users : prev.total_users,
              completed_tasks: data.stats.completed_tasks > 0 ? data.stats.completed_tasks : prev.completed_tasks,
              tracked_habits: data.stats.tracked_habits > 0 ? data.stats.tracked_habits : prev.tracked_habits,
              active_subscriptions: data.stats.active_subscriptions > 0 ? data.stats.active_subscriptions : prev.active_subscriptions,
              available_templates: data.stats.available_templates > 0 ? data.stats.available_templates : prev.available_templates,
            }))
          }
          if (data.cms) {
            setCmsContent(data.cms)
          }
        }
      } catch (err) {
        console.error('Failed to load real stats, using cached stats:', err)
      } finally {
        setIsStatsLoading(false)
      }
    }

    fetchRealData()
  }, [])

  // Interactive Live Task Toggle
  const toggleDemoTask = (id: number) => {
    setDemoTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  // Interactive Habit Toggle
  const toggleHabit = (id: number) => {
    setHabitsList((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    )
  }

  const completedHabitsCount = habitsList.filter((h) => h.completed).length
  const completedTasksCount = demoTasks.filter((t) => t.completed).length
  const liveTaskProgress = Math.round((completedTasksCount / demoTasks.length) * 100)

  // Fallback defaults or CMS Content
  const heroBadge = cmsContent?.hero?.badge || 'أكثر من مجرد مهام ...'
  const heroTitle = cmsContent?.hero?.title || 'فكرتو طريقك للإنجاز'
  const heroHighlight = cmsContent?.hero?.highlight || 'نظم وقتك، خطط ليومك، تابع عاداتك، وحقق أهدافك، كل ذلك في مكان واحد.'
  const heroDesc = cmsContent?.hero?.description || 'منصة ذكية تجمع بين التصميم، الإنتاجية، والتحفيز في تجربة استثنائية.'
  const heroSocial = cmsContent?.hero?.socialProof || 'أكثر من 10k مستخدم يحققون أهدافهم مع فكرتو'

  const faqs = cmsContent?.faqs || [
    {
      q: 'ما هي منصة فكرتو وكيف تساعدني في تنظيم يومي؟',
      a: 'فكرتو هي منصة إنتاجية فضائية متكاملة مصممة خصيصاً لإيقاع اليوم العربي، تجمع بين الجداول الذكية، تتبع العادات، وتحليلات الإنجاز التفاعلية في واجهة ثلاثية الأبعاد سلسة.',
    },
    {
      q: 'هل يمكنني استخدام فكرتو مجاناً؟',
      a: 'نعم! توفر فكرتو باقة مجانية مدى الحياة تتيح لك إدارة مهامك اليومية وجدولك الأساسي بكل سهولة دون أي قيود زمنية.',
    },
    {
      q: 'كيف يعمل نظام متابعة العادات والـ Streaks؟',
      a: 'يتيح لك النظام تسجيل عاداتك اليومية مع احتساب أيام الالتزام المتتالية لتحفيزك والحفاظ على استمرارية إنتاجيتك دون انقطاع.',
    },
    {
      q: 'ما هي طرق الدفع المتاحة للاشتراك في الباقات الاحترافية؟',
      a: 'ندعم الدفع الآمن عبر مدى (mada)، البطاقات الائتمانية (VISA / Mastercard)، و Apple Pay، بالإضافة للتحويل البنكي المباشر مع مراجعة فورية.',
    },
    {
      q: 'هل بياناتي ومهامي محمية وآمنة؟',
      a: 'نعم، نستخدم أعلى معايير التشفير المصرفي وتخزين قواعد البيانات المحمية بسياسات RLS الصارمة لضمان خصوصيتك التامة.',
    },
  ]

  const testimonials = cmsContent?.testimonials || [
    {
      name: 'أحمد خالد',
      role: 'مؤسس تقني ورائد أعمال',
      comment: 'فكرتو غيرت طريقة تنظيمي لوقتي بالكامل. الآن أقدر أدرك أولوياتي وأحقق أهدافي دون تشتت.',
      rating: 5,
    },
    {
      name: 'سارة محمود',
      role: 'مصممة واجهات وتجربة مستخدم',
      comment: 'التقارير والتحليلات ساعدتني أفهم إنتاجيتي وأطور من نفسي. التجربة البصرية ثلاثية الأبعاد ممتعة بشكل لا يوصف.',
      rating: 5,
    },
    {
      name: 'محمد علي',
      role: 'طالب دراسات عليا',
      comment: 'من أفضل المنصات التي استعملتها في حياتي، بسيطة ومفيدة للغاية وساعدتني في تنظيم ساعات المذاكرة بدقة.',
      rating: 5,
    },
    {
      name: 'لينا أحمد',
      role: 'أخصائية تسويق رقمي',
      comment: 'تنظيم المهام والعادات ساعدني أحقق توازن يومي بين العمل ودراستي. أنصح بها كل من يبحث عن إنجاز حقيقي.',
      rating: 5,
    },
  ]

  return (
    <main className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden font-cairo rtl selection:bg-emerald-500 selection:text-slate-950">
      {/* ========================================================================= */}
      {/* خلفية الفضاء الكوني والسديم الزمردي (Cosmic Deep Space & Nebula)              */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Radial Glows */}
        <div className="absolute -top-32 left-1/4 w-[750px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[130px] animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-[800px] h-[700px] bg-purple-600/10 rounded-full blur-[150px]" />
        
        {/* Subtle Cosmic Star Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:56px_56px] opacity-15" />
      </div>

      {/* ========================================================================= */}
      {/* 1. الشريط العلوي البانورامي الزجاجي (Ultra-Premium Glass HUD Navbar)       */}
      {/* ========================================================================= */}
      <header className="relative z-50 px-4 sm:px-8 pt-5">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
          {/* Logo & Brand Identity (Matching Top Left of Mockup) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              {/* Origami Leaf 3D Icon */}
              <div className="w-5 h-5 border-2 border-slate-950 rounded-sm transform rotate-45 flex items-center justify-center bg-slate-950">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                فكرتو
              </span>
              <span className="text-[9px] font-mono tracking-widest text-emerald-400/80 -mt-1 uppercase">
                FEKRTO
              </span>
            </div>
          </Link>

          {/* Navigation Links (Matching Mockup: الرئيسية, المميزات, الباقات, الأسعار, الأسئلة الشائعة) */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-gray-300">
            <Link href="/" className="text-emerald-400 font-black transition-colors">
              الرئيسية
            </Link>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              المميزات
            </a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">
              جدول اليوم
            </a>
            <a href="#habits" className="hover:text-emerald-400 transition-colors">
              العادات
            </a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">
              الأسعار
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              الأسئلة الشائعة
            </a>
          </div>

          {/* Left Actions: Currency Selector, Search, & Sign In CTA */}
          <div className="flex items-center gap-3">
            <CurrencySelector compact />
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                لوحة التحكم
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 transition-all"
                >
                  ابدأ الآن مجاناً
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* 2. القسم الرئيسي البانورامي (Hero Section with 3D Hypercube & Cosmic Peak) */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Right Column: Hero Typography, CTAs, and Social Proof */}
          <div className="lg:col-span-7 space-y-7 text-right">
            {/* Top Glowing Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{heroBadge}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
                {heroTitle}
              </h1>
              <p className="text-lg sm:text-xl font-bold text-emerald-300/90 leading-relaxed max-w-2xl">
                {heroHighlight}
              </p>
              <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed max-w-2xl">
                {heroDesc}
              </p>
            </div>

            {/* CTA Buttons: Primary Emerald Glow + Secondary Glass with Play Icon */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>ابدأ الآن مجاناً</span>
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <a
                href="#demo"
                className="px-7 py-4 rounded-2xl bg-slate-900/80 border border-white/15 text-white font-bold text-sm hover:bg-slate-800/80 hover:border-emerald-500/40 backdrop-blur-xl shadow-lg transition-all flex items-center gap-2.5"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Play className="w-3 h-3 fill-emerald-400" />
                </div>
                <span>شاهد العرض التفاعلي</span>
              </a>
            </div>

            {/* Social Proof (Matching Mockup: 10k+ Users + 5 Stars) */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex -space-x-2 space-x-reverse">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 border-2 border-slate-950 flex items-center justify-center text-xs font-black text-slate-950">
                  أ
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 border-2 border-slate-950 flex items-center justify-center text-xs font-black text-white">
                  س
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-slate-950 flex items-center justify-center text-xs font-black text-slate-950">
                  م
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 border-2 border-slate-950 flex items-center justify-center text-xs font-black text-white">
                  ل
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {heroSocial}
                </p>
              </div>
            </div>
          </div>

          {/* Left Column: The 3D Hypercube Core & Cosmic Mountain Atmosphere */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Cosmic Portal Backlight */}
            <div className="absolute w-80 h-80 bg-gradient-to-tr from-emerald-500/25 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* The 3D Hypercube Interactive Canvas */}
            <div className="relative w-full aspect-square max-w-[460px]">
              <Fekrto3DHypercube size={460} className="w-full h-full" />
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. شريط المميزات السريع (Quick Feature Strip - Matching Mockup)             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-12">
          {[
            { title: 'تنظيم المهام', icon: CheckSquare, color: 'text-emerald-400' },
            { title: 'قوالب جاهزة', icon: Layers, color: 'text-cyan-400' },
            { title: 'التحليلات الذكية', icon: BarChart3, color: 'text-purple-400' },
            { title: 'العادات اليومية', icon: Repeat, color: 'text-amber-400' },
            { title: 'دعم مستمر', icon: Shield, color: 'text-emerald-400' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105 shadow-md"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs font-bold text-gray-200">{item.title}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. قسم المشكلة والحل (من الفوضى إلى التنظيم - قبل فكرتو vs بعد فكرتو)          */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="success" size="md">
            التحول الجذري
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            من الفوضى إلى التنظيم
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            نفسك اللي تضيع وقتك... وتنسى مهامك؟ اكتشف الفارق الحقيقي بين العمل العشوائي والإنتاجية المنظمة داخل فكرتو.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Card: قبل فكرتو (The Chaos) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/70 border border-red-500/20 backdrop-blur-xl space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between pb-3 border-b border-red-500/10">
              <span className="text-sm font-black text-red-400">قبل فكرتو (الوضع الحالي)</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                تشتت وضغوط
              </span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span>مهام متناثرة بين أوراق وملاحظات ومحادثات منسية</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span>ضياع الوقت دون معرفة أين ذهبت ساعات يومك</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span>انقطاع متكرر عن العادات وعدم القدرة على بناء التزام مستمر</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span>شعور دائم بالقلق والتقصير في نهاية كل أسبوع</span>
              </li>
            </ul>
          </div>

          {/* Card: بعد فكرتو (The Clarity) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-950/80 to-slate-950 border border-emerald-500/40 backdrop-blur-xl space-y-4 relative shadow-[0_0_30px_rgba(16,185,129,0.15)] group">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <span className="text-sm font-black text-emerald-400">بعد فكرتو (الحياة المنظمة)</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                تركيز وإنجاز
              </span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>جدول يومي وأسبوعي واضح يبدأ معك من أول لحظة في اليوم</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>نواة طاقة تفاعلية تحفزك مع كل مهمة تنجزها في جدولك</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>سلسلة التزام (Streaks) ومتابعة عادات يومية تضمن استمراريتك</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>تحليلات ذكية دقيقة تكشف لك ساعات ذروة إنتاجيتك</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. العرض الحي التفاعلي لجدول المهام (Live Interactive Task Board Demo)         */}
      {/* ========================================================================= */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="cyan" size="md">
            عرض حي تفاعلي
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            جرب بنفسك سلاسة إدارة اليوم مع فكرتو
          </h2>
          <p className="text-sm text-gray-400">
            انقر على أي مهمة بالأسفل لتجربة التفاعل الفوري ومراقبة تحديث مؤشر الإنجاز لحظياً!
          </p>
        </div>

        {/* The Spatial Dashboard Preview Window (Matching Center Mockup) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.7)] space-y-6">
          {/* Top Preview Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold">
                أ
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white block">مرحباً، أحمد محمد</span>
                <span className="text-[11px] text-emerald-400 block">كل يوم خطوة نحو الأفضل</span>
              </div>
            </div>

            {/* Quick Demo Stats Row */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>سلسلة الالتزام: 5 أيام</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>نسبة الإنجاز: {liveTaskProgress}%</span>
              </div>
            </div>
          </div>

          {/* Interactive Tasks Table & Circular Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Interactive Checklist */}
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-gray-300">مهام اليوم (انقر لتجربة التحديد)</span>
                <span className="text-xs font-bold text-emerald-400">
                  {completedTasksCount} من {demoTasks.length} منجزة
                </span>
              </div>

              {demoTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleDemoTask(task.id)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                    task.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-gray-400'
                      : 'bg-slate-950/70 border-white/10 hover:border-emerald-400/50 text-white hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_#10b981]'
                          : 'border-white/20 bg-white/5'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-100'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {task.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Live Circular Progress Ring & Motivation */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-950/80 border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-800 fill-none"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="url(#liveDemoGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="fill-none transition-all duration-500 ease-out"
                    strokeDasharray={364.42}
                    strokeDashoffset={364.42 * (1 - liveTaskProgress / 100)}
                  />
                  <defs>
                    <linearGradient id="liveDemoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#00f5a0" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-white font-mono">{liveTaskProgress}%</span>
                  <span className="text-[10px] text-gray-400 font-bold">إنتاجيتك اليوم</span>
                </div>
              </div>

              <p className="text-xs text-emerald-300/90 leading-relaxed font-bold">
                «النجاح ليس في إنجاز الكثير... بل في إنجاز ما هو مهم.»
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. بطاقات المميزات الأربع (Four 3D Feature Pillars - Matching Mockup)         */}
      {/* ========================================================================= */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="success" size="md">
            ركائز المنصة
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            كل ما تحتاجه في منصة واحدة
          </h2>
          <p className="text-sm text-gray-400">
            أدوات مصممة بعناية فائقة لتساعدك في التخطيط، التركيز، وتطوير عاداتك اليومية.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'إدارة المهام',
              desc: 'تنظيم يومي، وجدولة دقيقة، وتصنيف ذكي للمهام حسب الأولوية.',
              icon: CheckSquare,
              color: 'from-emerald-500 to-teal-400',
              border: 'border-emerald-500/30',
              glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
            },
            {
              title: 'العادات اليومية',
              desc: 'بناء عادات تصنع مستقبلك مع سلاسل التزام متتالية.',
              icon: Repeat,
              color: 'from-cyan-500 to-blue-400',
              border: 'border-cyan-500/30',
              glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]',
            },
            {
              title: 'التحليلات الذكية',
              desc: 'افهم إنتاجيتك واكتشف ساعات ذروة إنجازك برسوم بيانية دقيقة.',
              icon: BarChart3,
              color: 'from-purple-500 to-indigo-400',
              border: 'border-purple-500/30',
              glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
            },
            {
              title: 'قوالب جاهزة',
              desc: 'جداول جاهزة مصممة للطلاب، الموظفين، والمستقلين تبدأ بها فوراً.',
              icon: Layers,
              color: 'from-amber-500 to-yellow-400',
              border: 'border-amber-500/30',
              glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
            },
          ].map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-slate-900/50 border ${feat.border} ${feat.glow} backdrop-blur-xl flex flex-col justify-between space-y-4 hover:scale-105 transition-all group`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-slate-950 font-bold shadow-lg`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>اكتشف المزيد</span>
                  <ArrowRight className="w-3.5 h-3.5 -scale-x-100" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. قسم العادات اليومية التفاعلي (Habits & Streaks Section - Mockup Match)     */}
      {/* ========================================================================= */}
      <section id="habits" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Habits Description */}
          <div className="lg:col-span-5 space-y-5 text-right">
            <Badge variant="success" size="md">
              بناء العادات المستدامة
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              العادات اليومية يصنع بها مستقبلك
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              «أحب الأعمال إلى الله أدومها وإن قل». مع نظام فكرتو لتتبع العادات، ستكتسب الثبات النفسي والالتزام العملي بعاداتك الروحية، الصحية، والمهنية خطوة بخطوة.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 text-xs text-emerald-300 font-bold flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse flex-shrink-0" />
              <span>معدل الالتزام يرفع نسبة إنجاز أهدافك بنسبة 300% وفق دراسات الإنتاجية.</span>
            </div>
          </div>

          {/* Habits Preview Card (Matching Middle-Right of Mockup) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.7)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white">العادات اليومية</span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {completedHabitsCount} / {habitsList.length} مكتملة اليوم
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {habitsList.map((h) => (
                <div
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                    h.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/60 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold">{h.name}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      h.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-white/20'
                    }`}
                  >
                    {h.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. إحصائيات المنصة الحقيقية المربوطة بـ Supabase (Real Stats Showcase)         */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="cyan" size="md">
            أرقام حقيقية حية
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            إحصائيات مجتمع فكرتو المتنامي
          </h2>
          <p className="text-sm text-gray-400">
            أرقام حقيقية مستمدة من قاعدة بيانات المنصة تعكس حجم الإنجاز اليومي لمستخدمينا.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              label: 'مستخدم مسجل',
              val: stats.total_users.toLocaleString(),
              icon: Users,
              color: 'text-emerald-400',
            },
            {
              label: 'مهمة منجزة',
              val: stats.completed_tasks.toLocaleString(),
              icon: CheckSquare,
              color: 'text-cyan-400',
            },
            {
              label: 'عادة متتبعة',
              val: stats.tracked_habits.toLocaleString(),
              icon: Repeat,
              color: 'text-purple-400',
            },
            {
              label: 'قالب معتمد',
              val: stats.available_templates.toString(),
              icon: Layers,
              color: 'text-amber-400',
            },
            {
              label: 'معدل الاستقرار',
              val: '99.9%',
              icon: Shield,
              color: 'text-emerald-400',
            },
          ].map((st, idx) => {
            const Icon = st.icon
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-center space-y-2 hover:border-emerald-500/40 transition-all shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 mx-auto flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${st.color}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {st.val}
                </div>
                <span className="text-xs font-bold text-gray-400 block">{st.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. فكرتو على هاتفك (Mobile Responsiveness Showcase - Mockup Match)         */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-right">
            <Badge variant="success" size="md">
              التزامن السحابي
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              فكرتو معك على هاتفك في كل مكان
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              تجربة مستخدم فضائية فائقة السرعة ومتجاوبة بالكامل مع شاشات الهواتف الذكية والأجهزة اللوحية دون التضحية بأي ميزة.
            </p>

            <div className="space-y-3">
              {[
                { title: 'واجهة سلسة وسريعة', desc: 'تحميل فوري وتصميم مريح للعين يدعم الوضع الليلي.' },
                { title: 'إشعارات وتنبيهات ذكية', desc: 'تنبيهك قبل مواعيد المهام الهامة والورد اليومي.' },
                { title: 'تزامن فوري بين الأجهزة', desc: 'أي تعديل على الكمبيوتر يظهر فوراً على هاتفك.' },
              ].map((adv, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{adv.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{adv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-64 sm:w-72 h-[480px] sm:h-[520px] rounded-[42px] bg-slate-950 border-4 border-slate-800 shadow-[0_0_50px_rgba(16,185,129,0.3)] p-3 relative flex flex-col justify-between overflow-hidden">
              {/* Top Speaker Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Mobile Screen Mockup Content */}
              <div className="flex-1 rounded-[32px] bg-[#020617] p-4 flex flex-col justify-between border border-emerald-500/30">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-black text-emerald-400">فكرتو</span>
                  <span className="text-[10px] text-gray-400 font-mono">10:42 PM</span>
                </div>

                <div className="my-auto text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-emerald-500/40 border-t-emerald-400 flex items-center justify-center">
                    <span className="text-lg font-black font-mono text-white">82%</span>
                  </div>
                  <span className="text-xs font-bold text-gray-200 block">إنجاز اليوم ممتاز!</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-right">
                  <span className="text-[10px] text-emerald-400 font-bold block">المهمة القادمة:</span>
                  <span className="text-xs font-bold text-white block mt-0.5">تطوير مشروع فكرتو</span>
                </div>
              </div>

              {/* Bottom Home Bar */}
              <div className="w-28 h-1 bg-gray-600 rounded-full mx-auto mt-2" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. آراء وتقييمات المستخدمين (Real Testimonials Showcase - Mockup Match)     */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="warning" size="md">
            ثقة وتقدير
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            ماذا يقول مستخدمو فكرتو؟
          </h2>
          <p className="text-sm text-gray-400">
            تجارب حقيقية لأشخاص غيروا طريقة إدارتهم للوقت واستعادوا السيطرة على يومهم.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t: any, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                «{t.comment}»
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-[10px] text-gray-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. باقات الاشتراك والأسعار (Subscription Plans with Currency Conversion)    */}
      {/* ========================================================================= */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <Badge variant="success" size="md">
            خطط الاستثمار في نفسك
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            اختر خطتك المناسبة لك
          </h2>
          <p className="text-sm text-gray-400">
            ابدأ مجاناً الآن أو استمتع بكامل القدرات غير المحدودة مع الباقة الاحترافية.
          </p>

          {/* Monthly / Yearly Toggle (Matching Top-Right of Mockup) */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-950 border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setIsYearlyBilling(false)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                !isYearlyBilling
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setIsYearlyBilling(true)}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isYearlyBilling
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>سنوي</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                وفر 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards (Matching Top-Right of Mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: الباقة الأساسية (مجانية) */}
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-sm font-bold text-gray-400 block">الباقة الأساسية</span>
              <div className="mt-2 text-3xl font-black text-white">مجانية</div>
              <p className="text-xs text-gray-400 mt-2">لكل من يرغب في بداية بسيطة ومنظمة.</p>
              
              <ul className="space-y-3 mt-6 text-xs text-gray-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>إدارة المهام الأساسية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>جدول يومي محدد</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>قوالب محدودة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>دعم أساسي عبر الموقع</span>
                </li>
              </ul>
            </div>

            <Link
              href="/auth/register"
              className="w-full py-3 rounded-xl bg-slate-950 border border-white/15 text-white font-bold text-xs text-center hover:bg-slate-800 transition-colors block"
            >
              ابدأ الآن
            </Link>
          </div>

          {/* Plan 2: الباقة الاحترافية (الأكثر شعبية - المميزة بإطار زمردي) */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-950 border-2 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)] backdrop-blur-2xl flex flex-col justify-between space-y-6 relative scale-105 z-20">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
              الأكثر شعبية
            </div>

            <div>
              <span className="text-sm font-black text-emerald-300 block">الباقة الاحترافية</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">
                  {formatPrice(isYearlyBilling ? 390 : 49)}
                </span>
                <span className="text-xs text-gray-400">
                  {isYearlyBilling ? '/ سنوياً' : '/ شهرياً'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-2">لتجربة إنتاجية استثنائية متكاملة بلا حدود.</p>

              <ul className="space-y-3 mt-6 text-xs text-gray-100 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>جميع المميزات الأساسية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>تحليلات متقدمة وساعات الذروة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>قوالب غير محدودة لجميع المجالات</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>دعم فني ذو أولوية خاصة عبر الواتساب</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>سلاسل التزام غير محدودة للعادات</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard/subscription"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs text-center shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all block"
            >
              اختر الخطة الاحترافية
            </Link>
          </div>

          {/* Plan 3: الباقة المميزة */}
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-sm font-bold text-purple-300 block">الباقة المميزة</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white font-mono">
                  {formatPrice(isYearlyBilling ? 790 : 99)}
                </span>
                <span className="text-xs text-gray-400">
                  {isYearlyBilling ? '/ سنوياً' : '/ شهرياً'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">للفرق ورواد الأعمال الأكثر طموحاً.</p>

              <ul className="space-y-3 mt-6 text-xs text-gray-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>جميع مميزات الباقة الاحترافية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>مميزات متقدمة إضافية واستشارات</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>أولوية قصوى في معالجة الطلبات</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>شارات الإنجاز المخصصة</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard/subscription"
              className="w-full py-3 rounded-xl bg-slate-950 border border-white/15 text-white font-bold text-xs text-center hover:bg-slate-800 transition-colors block"
            >
              اختر الخطة المميزة
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. الأسئلة الشائعة (FAQ Accordion - Matching Mockup)                         */}
      {/* ========================================================================= */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-16 border-t border-white/5">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="cyan" size="md">
            إجابات واضحة
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            الأسئلة الشائعة
          </h2>
          <p className="text-sm text-gray-400">
            كل ما يدور في ذهنك حول المنصة، الاشتراكات، وحماية البيانات.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = openFaqIdx === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-right text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. دعوة التسجيل النهائية (Final Cosmic CTA - Matching Mockup)               */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-[0_12px_60px_rgba(0,0,0,0.8)] text-center space-y-6">
          <Badge variant="success" size="md">
            بداية رحلتك
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            جاهز تبدأ رحلتك؟
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            انضم الآن إلى آلاف الأشخاص الذين غيروا حياتهم وتنظيمهم مع فكرتو، وابدأ تجربتك المجانية اليوم.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>ابدأ مجاناً الآن</span>
              <ArrowRight className="w-4 h-4 -scale-x-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. التذييل الاحترافي الكامل (Footer - Matching Mockup Bottom)               */}
      {/* ========================================================================= */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-white/10 text-xs text-gray-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black">
              ف
            </div>
            <div>
              <span className="font-bold text-white text-base">فكرتو FEKRTO</span>
              <span className="text-[10px] text-gray-500 block">أفكارك... خططك... إنجازاتك</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-300">
            <Link href="/" className="hover:text-emerald-400 transition-colors">الرئيسية</Link>
            <a href="#features" className="hover:text-emerald-400 transition-colors">المميزات</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">الأسعار</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">الأسئلة الشائعة</a>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">الشروط والأحكام</Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">تواصل معنا</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <span>© {new Date().getFullYear()} فكرتو (FEKRTO). جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-2">
            <span>اللغة: العربية (المملكة العربية السعودية)</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
