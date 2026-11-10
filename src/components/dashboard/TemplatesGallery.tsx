'use client'

import React, { useState } from 'react'
import type { ScheduleTemplate } from '@/types/database'
import {
  PlusCircle,
  Briefcase,
  GraduationCap,
  Heart,
  Check,
  Edit,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

interface TemplatesGalleryProps {
  templates?: ScheduleTemplate[]
  onApplyTemplate: (templateCategory: string, selectedColor: string) => Promise<void>
}

export function TemplatesGallery({ templates = [], onApplyTemplate }: TemplatesGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<'work' | 'study' | 'balanced' | 'blank'>('work')
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'goals' | 'notes'>('tasks')
  const [selectedColor, setSelectedColor] = useState('#0d9488')
  const [isApplying, setIsApplying] = useState(false)

  // Color dots available in the preview
  const paletteColors = ['#0d9488', '#0284c7', '#7c3aed', '#ec4899', '#f59e0b', '#ef4444']

  // Pre-configured templates data matching image
  const defaultTemplates = [
    {
      category: 'blank' as const,
      name: 'جدول فارغ',
      description: 'ابدأ من الصفر وأنشئ جدولك الخاص بحرية كاملة دون أي مهام مسبقة',
      icon: PlusCircle,
      accent: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      btnColor: 'bg-teal-500 hover:bg-teal-400 text-slate-950',
    },
    {
      category: 'work' as const,
      name: 'قالب العمل',
      description: 'مناسب للمحترفين ورواد الأعمال وأصحاب المشاريع لزيادة التركيز',
      icon: Briefcase,
      accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      btnColor: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
    },
    {
      category: 'study' as const,
      name: 'قالب الدراسة',
      description: 'مصمم خصيصاً للطلاب والباحثين لتنظيم المذاكرة والمحاضرات',
      icon: GraduationCap,
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      btnColor: 'bg-purple-500 hover:bg-purple-400 text-white',
    },
    {
      category: 'balanced' as const,
      name: 'قالب الحياة المتوازنة',
      description: 'يوازن بين العمل، الدراسة، الصحة، والعائلة لعيش حياة متوازنة',
      icon: Heart,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      btnColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    },
  ]

  // Mock days for visual preview matching image
  const previewDays = [
    {
      day: 'السبت',
      date: '8',
      tasks: [
        { title: 'مراجعة أهداف الأسبوع', color: '#0284c7' },
        { title: 'جلسة عمل عميق 90 دقيقة', color: '#7c3aed' },
        { title: 'مراجعة الرسائل والبريد', color: '#f59e0b' },
      ],
    },
    {
      day: 'الأحد',
      date: '9',
      tasks: [
        { title: 'اجتماع فريق العمل الصباحي', color: '#0d9488' },
        { title: 'إنجاز تسليمات المشروع', color: '#0284c7' },
        { title: 'متابعة العملاء', color: '#f59e0b' },
      ],
    },
    {
      day: 'الاثنين',
      date: '10',
      tasks: [
        { title: 'تطوير وتجهيز التقرير', color: '#7c3aed' },
        { title: 'جلسة عصف ذهني', color: '#0d9488' },
      ],
    },
    {
      day: 'الأربعاء',
      date: '12',
      tasks: [
        { title: 'مراجعة الميزانية والأداء', color: '#0284c7' },
        { title: 'تنسيق خطة النشر', color: '#f59e0b' },
      ],
    },
    {
      day: 'الخميس',
      date: '13',
      tasks: [
        { title: 'إغلاق مهام الأسبوع المعلقة', color: '#0d9488' },
        { title: 'تقييم إنجازات الأسبوع', color: '#7c3aed' },
      ],
    },
    {
      day: 'الجمعة',
      date: '14',
      tasks: [
        { title: 'ورد اليوم وصلاة الجمعة', color: '#10b981' },
        { title: 'وقت عائلي واستجمام', color: '#f59e0b' },
      ],
    },
  ]

  const handleApply = async () => {
    setIsApplying(true)
    try {
      await onApplyTemplate(selectedCategory, selectedColor)
    } finally {
      setIsApplying(false)
    }
  }

  const selectedTemplate = defaultTemplates.find((t) => t.category === selectedCategory) || defaultTemplates[1]

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>قوالب جاهزة اختيارية</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
            Templates
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          ابدأ من جدول فارغ تماماً أو اختر قالباً احترافياً جاهزاً وعدّله بحرية كاملة
        </p>
      </div>

      {/* 2. Top 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultTemplates.map((t) => {
          const isSelected = selectedCategory === t.category
          const Icon = t.icon

          return (
            <div
              key={t.category}
              onClick={() => setSelectedCategory(t.category)}
              className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-teal-400 ring-2 ring-teal-500/30 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${t.accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{t.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {t.description}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCategory(t.category)
                  handleApply()
                }}
                disabled={isApplying}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${t.btnColor}`}
              >
                <span>استخدام القالب</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* 3. Live Interactive Preview Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>معاينة القالب – {selectedTemplate.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              استعراض الهيكل المبدئي، يمكنك التعديل وإضافة أو حذف أي مهام وعادات لاحقاً
            </p>
          </div>

          {/* Sub Tabs */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            {[
              { id: 'tasks' as const, label: 'المهام' },
              { id: 'habits' as const, label: 'العادات' },
              { id: 'goals' as const, label: 'الأهداف' },
              { id: 'notes' as const, label: 'ملاحظات' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Preview Columns */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] grid grid-cols-6 gap-3">
            {previewDays.map((d) => (
              <div
                key={d.day}
                className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between"
              >
                <div className="text-center pb-2 mb-2 border-b border-slate-800/60">
                  <span className="text-xs font-bold text-slate-300 block">{d.day}</span>
                  <span className="text-sm font-bold text-teal-400 font-mono">{d.date}</span>
                </div>

                <div className="space-y-1.5 min-h-[140px]">
                  {selectedCategory === 'blank' ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-600 text-center">
                      خانات فارغة
                    </div>
                  ) : (
                    d.tasks.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-lg text-[10px] text-white flex items-center justify-between gap-1 shadow-sm opacity-90 hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: `${selectedColor}40`, borderRight: `3px solid ${selectedColor}` }}
                      >
                        <span className="line-clamp-1">{t.title}</span>
                        <div className="w-2.5 h-2.5 rounded-full border border-white/40 flex-shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer of Preview: Color Picker & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          {/* Color theme picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">ألوان القالب:</span>
            <div className="flex items-center gap-2">
              {paletteColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                    selectedColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplying}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>استخدام هذا القالب الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
