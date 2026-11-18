'use client'

import React, { useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { audioChime } from '@/lib/audioChime'
import {
  Settings,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Zap,
  Sliders,
  Bell,
  Eye,
  Check,
} from 'lucide-react'
import type { MonthlyHabitSettings } from '@/types/database'

interface HabitSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: Partial<MonthlyHabitSettings>
  onSaveSettings: (newSettings: Partial<MonthlyHabitSettings>) => Promise<void>
}

export function HabitSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}: HabitSettingsModalProps) {
  const [autoRotate, setAutoRotate] = useState(settings.auto_rotate_images ?? true)
  const [rotateInterval, setRotateInterval] = useState(settings.rotate_interval_seconds ?? 30)
  const [soundEnabled, setSoundEnabled] = useState(settings.sound_enabled ?? false)
  const [soundVolume, setSoundVolume] = useState(settings.sound_volume ?? 0.5)
  const [reducedMotion, setReducedMotion] = useState(settings.reduced_motion ?? false)
  const [preferredView, setPreferredView] = useState<'original' | 'enhanced'>(
    settings.preferred_view || 'original'
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleTestSound = () => {
    audioChime.playHabitComplete(soundVolume)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSaveSettings({
        auto_rotate_images: autoRotate,
        rotate_interval_seconds: rotateInterval,
        sound_enabled: soundEnabled,
        sound_volume: soundVolume,
        reduced_motion: reducedMotion,
        preferred_view: preferredView,
      })
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تخصيص تجربة متابعة العادات"
      size="md"
    >
      <div className="space-y-6 text-right font-cairo">
        {/* Preferred Default View */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300">طريقة العرض الافتراضية</label>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setPreferredView('original')}
              className={`p-3 rounded-xl border text-center transition-all ${
                preferredView === 'original'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-white/10 text-gray-400'
              }`}
            >
              العرض الأصلي (جدول Excel)
            </button>
            <button
              type="button"
              onClick={() => setPreferredView('enhanced')}
              className={`p-3 rounded-xl border text-center transition-all ${
                preferredView === 'enhanced'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-white/10 text-gray-400'
              }`}
            >
              العرض المطور (بطاقات ذكية)
            </button>
          </div>
        </div>

        {/* Image Rotation Settings */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <input
              type="checkbox"
              id="autoRotateCheck"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0 accent-cyan-400 cursor-pointer"
            />
            <label
              htmlFor="autoRotateCheck"
              className="text-xs font-bold text-white cursor-pointer"
            >
              التغيير التلقائي للصور التحفيزية
            </label>
          </div>

          {autoRotate && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono text-cyan-300">{rotateInterval} ثانية</span>
                <span>فترة تبديل الصورة:</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setRotateInterval(sec)}
                    className={`py-1.5 rounded-lg border text-center font-bold ${
                      rotateInterval === sec
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sec}ث
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audio Effects Settings */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <input
              type="checkbox"
              id="soundCheck"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-0 accent-emerald-400 cursor-pointer"
            />
            <label htmlFor="soundCheck" className="text-xs font-bold text-white cursor-pointer">
              مؤثرات صوتية هادئة عند إنجاز العادات
            </label>
          </div>

          {soundEnabled && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleTestSound}
                className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
              >
                <Volume2 className="w-3.5 h-3.5 ml-1.5" />
                <span>تجربة الصوت الآن ♫</span>
              </Button>
              <span className="text-[11px] text-gray-400">
                نغمة بلورية لطيفة تعزز شعور الإنجاز
              </span>
            </div>
          )}
        </div>

        {/* Reduced Motion Toggle */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <input
            type="checkbox"
            id="reducedMotionCheck"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="w-4 h-4 rounded text-cyan-500 focus:ring-0 accent-cyan-400 cursor-pointer"
          />
          <div className="text-right">
            <label
              htmlFor="reducedMotionCheck"
              className="text-xs font-bold text-white block cursor-pointer"
            >
              تقليل الحركة والمؤثرات البصرية (Reduced Motion)
            </label>
            <span className="text-[10px] text-gray-400">
              يقلل من حركات الانتقال والتأثيرات ثلاثية الأبعاد لتوفير الطاقة وزيادة راحة العين
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
