'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Sun, ChevronRight, ChevronLeft, Flame, Award, Heart } from 'lucide-react'
import type { MotivationalContent } from '@/types/database'

interface MotivationalHeroBannerProps {
  currentContent: MotivationalContent | null
  todayRate: number // 0 to 100
  todayCompletedCount: number
  todayTotalHabits: number
  onNext?: () => void
  onPrev?: () => void
  reducedMotion?: boolean
}

export function MotivationalHeroBanner({
  currentContent,
  todayRate,
  todayCompletedCount,
  todayTotalHabits,
  onNext,
  onPrev,
  reducedMotion = false,
}: MotivationalHeroBannerProps) {
  // Determine dynamic encouragement based on real progress
  const getProgressStatus = () => {
    if (todayTotalHabits === 0) return 'أضف عاداتك الأولى لتبدأ رحلتك'
    if (todayRate >= 100) return 'يوم أسطوري! أنجزت كافة عاداتك بالكامل'
    if (todayRate >= 75) return 'أداء استثنائي! تقترب من الإغلاق الكامل'
    if (todayRate >= 50) return 'أنت في منتصف الطريق، استمر بالقوة نفسها'
    if (todayRate > 0) return 'بداية مسددة، خطوة اليوم تصنع فرق الغد'
    return 'يوم جديد وفرصة ذهبية للإنجاز'
  }

  const defaultImage =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80'

  const activeImage = currentContent?.image_url || defaultImage
  const quoteTitle =
    currentContent?.quote_ar || 'أنت أقوى من أعذارك واستمر في رحلتك نحو الأفضل'
  const quoteSub =
    currentContent?.quote_subtext || 'كل إنجاز صغير يقربك من النسخة التي تحلم بها.'

  return (
    <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 shadow-[0_12px_40px_rgba(0,0,0,0.7)] min-h-[220px] sm:min-h-[250px] flex items-center group">
      {/* Background Image Layer with Cinematic Darkness Blend */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${activeImage}')` }}
          />
        </AnimatePresence>

        {/* Ambient Dark Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.85)_100%)] z-10" />
      </div>

      {/* Manual Switch Arrows (Hover Overlay) */}
      {onPrev && onNext && (
        <div className="absolute inset-y-0 inset-x-2 z-30 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onPrev}
            className="p-2 rounded-xl bg-slate-950/70 border border-white/10 text-white/70 hover:text-white pointer-events-auto backdrop-blur-md transition-all hover:scale-110 shadow-lg"
            title="الصورة السابقة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-xl bg-slate-950/70 border border-white/10 text-white/70 hover:text-white pointer-events-auto backdrop-blur-md transition-all hover:scale-110 shadow-lg"
            title="الصورة التالية"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Foreground Content Grid */}
      <div className="relative z-20 w-full px-6 py-6 sm:px-10 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Right Side: The Dynamic Quote & Milestone Pill (in RTL, this renders on the right) */}
        <div className="flex-1 text-right space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>يوم جديد. فرصة جديدة</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] max-w-xl font-cairo">
            {quoteTitle}
          </h2>

          <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed max-w-lg drop-shadow font-cairo">
            {quoteSub}
          </p>
        </div>

        {/* Left Side: Real-time Today's Commitment Glass Widget */}
        <div className="w-full md:w-auto flex-shrink-0">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[260px] text-right space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-gray-300">التزامك اليوم</div>
                <div className="text-2xl font-black text-cyan-300 font-cairo drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                  {todayRate}%
                </div>
              </div>
            </div>

            {/* Glowing Progress Track */}
            <div className="w-full bg-slate-950/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, todayRate))}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span className="text-cyan-400 font-bold">{todayCompletedCount} من {todayTotalHabits} منجز</span>
              <span>{getProgressStatus()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
