'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  ChevronRight,
  ChevronLeft,
  Palette,
  Edit,
  Trash2,
  Download,
  FolderArchive,
  Columns,
} from 'lucide-react'
import type { MotivationalContent } from '@/types/database'

interface MotivationalCarouselRowProps {
  items: MotivationalContent[]
  activeId: string | null
  onSelectContent: (content: MotivationalContent) => void
  autoRotate: boolean
  onToggleAutoRotate: () => void
  soundEnabled: boolean
  onToggleSound: () => void
  rotateInterval: number
  onOpenSettingsModal: () => void
  onOpenArchiveModal: () => void
}

export function MotivationalCarouselRow({
  items,
  activeId,
  onSelectContent,
  autoRotate,
  onToggleAutoRotate,
  soundEnabled,
  onToggleSound,
  rotateInterval,
  onOpenSettingsModal,
  onOpenArchiveModal,
}: MotivationalCarouselRowProps) {
  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Right side in RTL: Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white font-cairo">
              صور تحفيزية متغيرة
            </h4>
            <span className="text-[10px] text-gray-400">
              انقر على أي بطاقة لاختيار المشهد التحفيزي لبطاقة الترحيب
            </span>
          </div>
        </div>

        {/* Left side in RTL: Auto-rotate interval & Sound toggle */}
        <div className="flex items-center gap-2">
          {/* Auto rotate toggle */}
          <button
            onClick={onToggleAutoRotate}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 font-cairo ${
              autoRotate
                ? 'bg-cyan-950/60 border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'bg-slate-900 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={autoRotate ? 'إيقاف التبديل التلقائي' : 'تشغيل التبديل التلقائي'}
          >
            {autoRotate ? (
              <Pause className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span>الصورة كل {rotateInterval} ثانية</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 font-cairo ${
              soundEnabled
                ? 'bg-emerald-950/60 border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-slate-900 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={soundEnabled ? 'كتم مؤثرات الإنجاز' : 'تفعيل نغمات الإنجاز'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{soundEnabled ? 'الصوت مفعّل' : 'الصوت مكتوم'}</span>
          </button>
        </div>
      </div>

      {/* The Cards Row (Cards + General Settings) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 items-stretch">
        {/* 6 Inspirational Image Cards */}
        {items.map((item) => {
          const isSelected = activeId === item.id
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => onSelectContent(item)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer h-40 flex flex-col justify-end p-3 text-right group border transition-all ${
                isSelected
                  ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                  : 'border-white/10 hover:border-cyan-400/40'
              }`}
            >
              {/* Background Artwork */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image_url}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Selection Dot */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] shadow-md font-cairo">
                  مُفعل
                </div>
              )}

              {/* Quote Caption */}
              <div className="relative z-10 space-y-0.5">
                <p className="text-[11px] font-bold text-white leading-tight line-clamp-2 drop-shadow font-cairo">
                  {item.quote_ar}
                </p>
                <span className="text-[9px] text-cyan-300/80 block font-cairo truncate">
                  {item.title}
                </span>
              </div>
            </motion.div>
          )
        })}

        {/* 7th Card: General Settings Quick Nav Menu */}
        <div className="rounded-2xl p-3 bg-slate-950/80 border border-white/10 flex flex-col justify-between text-right space-y-2 h-40">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-white font-cairo">إعدادات عامة</span>
          </div>

          <div className="space-y-1 text-[11px] text-gray-300 font-cairo">
            <button
              onClick={onOpenSettingsModal}
              className="w-full flex items-center justify-between hover:text-cyan-300 py-0.5 transition-colors"
            >
              <Palette className="w-3 h-3 text-cyan-400" />
              <span>تخصيص الألوان</span>
            </button>
            <button
              onClick={onOpenSettingsModal}
              className="w-full flex items-center justify-between hover:text-cyan-300 py-0.5 transition-colors"
            >
              <Columns className="w-3 h-3 text-indigo-400" />
              <span>تخصيص الأعمدة</span>
            </button>
            <button
              onClick={onOpenArchiveModal}
              className="w-full flex items-center justify-between hover:text-cyan-300 py-0.5 transition-colors"
            >
              <FolderArchive className="w-3 h-3 text-amber-400" />
              <span>المجموعة والأرشيف</span>
            </button>
          </div>

          <div className="pt-1 border-t border-white/10 text-[9px] text-gray-500 text-center">
            فكرتو 2.0
          </div>
        </div>
      </div>
    </div>
  )
}
