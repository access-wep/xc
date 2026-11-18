'use client'

import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Textarea } from '@/components/ui'
import { HabitIconRenderer, HABIT_ICON_MAP } from './HabitIconRenderer'
import { Sparkles, Calendar, Target, Clock, ShieldCheck, Tag } from 'lucide-react'
import type { Habit } from '@/types/database'

interface AddEditHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (habitData: Partial<Habit>) => Promise<void>
  initialData?: Habit | null
}

const PRESET_COLORS = [
  '#22d3ee', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#a855f7', // Purple
  '#f43f5e', // Rose
  '#6366f1', // Indigo
  '#0284c7', // Sky
  '#14b8a6', // Teal
]

const DAYS_OF_WEEK = [
  { id: '0', label: 'الأحد' },
  { id: '1', label: 'الإثنين' },
  { id: '2', label: 'الثلاثاء' },
  { id: '3', label: 'الأربعاء' },
  { id: '4', label: 'الخميس' },
  { id: '5', label: 'الجمعة' },
  { id: '6', label: 'السبت' },
]

export function AddEditHabitModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddEditHabitModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('Sparkles')
  const [color, setColor] = useState('#22d3ee')
  const [category, setCategory] = useState('general')
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'specific_days' | 'times_per_week' | 'times_per_month' | 'custom'>('daily')
  const [targetDays, setTargetDays] = useState<string[]>(['0', '1', '2', '3', '4', '5', '6'])
  const [restDays, setRestDays] = useState<string[]>([])
  const [weeklyTarget, setWeeklyTarget] = useState(7)
  const [monthlyTarget, setMonthlyTarget] = useState(30)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setDescription(initialData.description || '')
      setIcon(initialData.icon || 'Sparkles')
      setColor(initialData.color || '#22d3ee')
      setCategory(initialData.category || 'general')
      setRecurrenceType(initialData.recurrence_type || 'daily')
      setTargetDays((initialData.target_days_json as string[]) || ['0', '1', '2', '3', '4', '5', '6'])
      setRestDays((initialData.rest_days_json as string[]) || [])
      setWeeklyTarget(initialData.weekly_target || initialData.target_days_per_week || 7)
      setMonthlyTarget(initialData.monthly_target || 30)
    } else {
      setName('')
      setDescription('')
      setIcon('Sparkles')
      setColor('#22d3ee')
      setCategory('general')
      setRecurrenceType('daily')
      setTargetDays(['0', '1', '2', '3', '4', '5', '6'])
      setRestDays([])
      setWeeklyTarget(7)
      setMonthlyTarget(30)
    }
    setError(null)
  }, [initialData, isOpen])

  const toggleTargetDay = (dayId: string) => {
    setTargetDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    )
  }

  const toggleRestDay = (dayId: string) => {
    setRestDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('يرجى إدخال اسم العادة.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
        icon,
        color,
        category,
        recurrence_type: recurrenceType,
        target_days_json: targetDays,
        rest_days_json: restDays,
        weekly_target: weeklyTarget,
        target_days_per_week: weeklyTarget,
        monthly_target: monthlyTarget,
        is_active: true,
      })
      onClose()
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ العادة.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'تعديل بيانات العادة' : 'إضافة عادة جديدة إلى الجدول'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-right font-cairo">
        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">اسم العادة *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: قراءة القرآن، الرياضة، شرب الماء"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">تصنيف العادة</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:border-cyan-400 focus:outline-none"
            >
              <option value="worship">عبادات وطاعات</option>
              <option value="health">صحة ورياضة</option>
              <option value="study">دراسة وتعلم</option>
              <option value="lifestyle">تنظيم حياة وإنتاجية</option>
              <option value="general">عامة</option>
            </select>
          </div>
        </div>

        {/* Icon & Color Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">المعاينة:</span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: color }}
              >
                <HabitIconRenderer name={icon} className="w-4 h-4" />
              </div>
            </div>
            <label className="text-xs font-bold text-gray-300">أيقونة ولون العادة</label>
          </div>

          {/* Color palette */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-lg transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Icon Picker Grid */}
          <div className="flex flex-wrap items-center justify-end gap-2 max-h-24 overflow-y-auto p-2 rounded-xl bg-slate-900/60 border border-white/5">
            {Object.keys(HABIT_ICON_MAP).map((iconKey) => (
              <button
                key={iconKey}
                type="button"
                onClick={() => setIcon(iconKey)}
                className={`p-2 rounded-lg transition-all ${
                  icon === iconKey
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={iconKey}
              >
                <HabitIconRenderer name={iconKey} className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Recurrence Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300">نظام التكرار</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'daily', label: 'يومياً (كل يوم)' },
              { id: 'specific_days', label: 'أيام محددة بالأسبوع' },
              { id: 'times_per_week', label: 'مرات أسبوعياً' },
              { id: 'times_per_month', label: 'مرات شهرياً' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setRecurrenceType(mode.id as any)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  recurrenceType === mode.id
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)] font-black'
                    : 'bg-slate-900 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specific Target Days (if selected) */}
        {recurrenceType === 'specific_days' && (
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
            <span className="text-[11px] font-bold text-cyan-300 block mb-1">
              حدد الأيام المستهدفة لهذه العادة:
            </span>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {DAYS_OF_WEEK.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleTargetDay(d.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    targetDays.includes(d.id)
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rest Days (أيام الراحة المحددة - لا تحسب إخفاقاً) */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/50 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">
              أيام الراحة لا تُحسب إخفاقاً في نسبة الالتزام
            </span>
            <span className="text-[11px] font-bold text-amber-300">
              أيام الراحة الاختيارية
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {DAYS_OF_WEEK.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleRestDay(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  restDays.includes(d.id)
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description / Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300">وصف أو هدف العادة (اختياري)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: قراءة جزء يومياً بعد صلاة الفجر"
            rows={2}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            {isSubmitting ? 'جاري الحفظ...' : initialData ? 'حفظ التعديلات' : 'إضافة العادة إلى الجدول'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
