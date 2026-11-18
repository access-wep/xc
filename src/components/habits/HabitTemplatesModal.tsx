'use client'

import React, { useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { HabitIconRenderer } from './HabitIconRenderer'
import {
  Sparkles,
  Layers,
  Check,
  Plus,
  Trash2,
  Copy,
  BookOpen,
  Sun,
  Dumbbell,
  Compass,
  AlertTriangle,
  BookmarkPlus,
} from 'lucide-react'
import type { HabitTemplate, Habit } from '@/types/database'

interface HabitTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  templates: HabitTemplate[]
  onApplyTemplate: (template: HabitTemplate, mode: 'append' | 'replace') => Promise<void>
  onSaveCurrentAsTemplate?: (title: string, description: string) => Promise<void>
  currentHabitsCount: number
}

export function HabitTemplatesModal({
  isOpen,
  onClose,
  templates,
  onApplyTemplate,
  onSaveCurrentAsTemplate,
  currentHabitsCount,
}: HabitTemplatesModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null)
  const [applyMode, setApplyMode] = useState<'append' | 'replace'>('append')
  const [isApplying, setIsApplying] = useState(false)
  const [showSaveCustom, setShowSaveCustom] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [customDesc, setCustomDesc] = useState('')

  const handleApply = async () => {
    if (!selectedTemplate) return
    setIsApplying(true)
    try {
      await onApplyTemplate(selectedTemplate, applyMode)
      onClose()
    } finally {
      setIsApplying(false)
    }
  }

  const handleSaveCurrent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customTitle.trim() || !onSaveCurrentAsTemplate) return
    setIsApplying(true)
    try {
      await onSaveCurrentAsTemplate(customTitle.trim(), customDesc.trim())
      setShowSaveCustom(false)
      setCustomTitle('')
      setCustomDesc('')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="مكتبة قوالب العادات الجاهزة"
      size="xl"
    >
      <div className="space-y-6 text-right font-cairo">
        {/* Header Introduction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
          <div className="text-right">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>حزم متكاملة مصممة لأعلى درجات الإنتاجية</span>
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              اختر قالباً جاهزاً لبدء شهرك فوراً بنقرة زر واحدة دون الحاجة لإدخال كل عادة يدوياً.
            </p>
          </div>

          {onSaveCurrentAsTemplate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSaveCustom(!showSaveCustom)}
              className="text-xs font-bold border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 flex-shrink-0"
            >
              <BookmarkPlus className="w-3.5 h-3.5 ml-1.5" />
              <span>حفظ عاداتي الحالية كقالب</span>
            </Button>
          )}
        </div>

        {/* Save Current as Template Form (Collapsible) */}
        {showSaveCustom && (
          <form
            onSubmit={handleSaveCurrent}
            className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-3"
          >
            <h5 className="text-xs font-bold text-purple-300">
              حفظ عاداتك الحالية ({currentHabitsCount} عادة) كقالب شخصي جديد:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="اسم القالب الجديد (مثال: عادات رمضان المبارك)"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-bold focus:border-purple-400 focus:outline-none"
              />
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="وصف مختصر للقالب"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-bold focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSaveCustom(false)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                حفظ القالب
              </Button>
            </div>
          </form>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto p-1">
          {templates.map((tpl) => {
            const isSelected = selectedTemplate?.id === tpl.id
            const habitsCount = (tpl.habits_data as any[])?.length || 0

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-right flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-950/70 border-white/10 hover:border-cyan-400/30 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-md">
                        ✓
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-gray-300 font-bold">
                      {habitsCount} عادات
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div>
                      <h5 className="text-sm font-black text-white font-cairo">
                        {tpl.title}
                      </h5>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                        {tpl.description}
                      </p>
                    </div>

                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                      style={{ backgroundColor: tpl.color || '#10b981' }}
                    >
                      <HabitIconRenderer name={tpl.icon} className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Habit preview pills */}
                <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-white/5">
                  {(tpl.habits_data as any[])?.slice(0, 4).map((h: any, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-gray-300 border border-white/5"
                    >
                      {h.name}
                    </span>
                  ))}
                  {habitsCount > 4 && (
                    <span className="text-[10px] text-cyan-400 font-bold">
                      +{habitsCount - 4} أخرى
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Application Options (Append vs Replace) */}
        {selectedTemplate && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>كيف ترغب في تطبيق قالب «{selectedTemplate.title}»؟</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setApplyMode('append')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  applyMode === 'append'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-white/10 text-gray-400'
                }`}
              >
                <div className="text-right">
                  <span className="block font-bold">إضافة إلى عاداتي الحالية</span>
                  <span className="text-[10px] text-gray-400">
                    يحافظ على عاداتك المسجلة ويضيف عادات القالب بجانبها
                  </span>
                </div>
                <input
                  type="radio"
                  name="applyMode"
                  checked={applyMode === 'append'}
                  onChange={() => setApplyMode('append')}
                  className="accent-cyan-400 ml-2"
                />
              </label>

              <label
                onClick={() => setApplyMode('replace')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  applyMode === 'replace'
                    ? 'bg-red-500/15 border-red-400 text-red-300 font-bold'
                    : 'bg-slate-950 border-white/10 text-gray-400'
                }`}
              >
                <div className="text-right">
                  <span className="block font-bold">استبدال العادات الحالية</span>
                  <span className="text-[10px] text-gray-400">
                    يستبدل عادات الشهر الحالي بعادات هذا القالب
                  </span>
                </div>
                <input
                  type="radio"
                  name="applyMode"
                  checked={applyMode === 'replace'}
                  onChange={() => setApplyMode('replace')}
                  className="accent-red-400 ml-2"
                />
              </label>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onClose} disabled={isApplying}>
            إغلاق
          </Button>
          <Button
            type="button"
            disabled={!selectedTemplate || isApplying}
            onClick={handleApply}
            className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          >
            {isApplying ? 'جاري التطبيق...' : 'تطبيق هذا القالب الآن'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
