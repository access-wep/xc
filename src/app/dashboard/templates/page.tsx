'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { PaywallLockedCard } from '@/components/dashboard/PaywallLockedCard'
import { createClient } from '@/lib/supabase/client'
import { TemplatesGallery } from '@/components/dashboard/TemplatesGallery'
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react'

export default function TemplatesPage() {
  const { user } = useAuth()
  const { canAccessTemplates, isLoading: isPlanLoading } = usePlanFeatures()
  const router = useRouter()
  const supabase = createClient()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleApplyTemplate = async (templateCategory: string, selectedColor: string) => {
    if (!user) return

    try {
      const today = new Date()
      const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

      let scheduleName = 'جدولي الجديد'
      if (templateCategory === 'work') scheduleName = 'جدول العمل والإنتاجية'
      else if (templateCategory === 'study') scheduleName = 'جدول الدراسة والتحصيل'
      else if (templateCategory === 'balanced') scheduleName = 'جدول الحياة المتوازنة'

      const startDate = today.toISOString().split('T')[0]
      const endDateObj = new Date(today)
      endDateObj.setDate(endDateObj.getDate() + 6)
      const endDate = endDateObj.toISOString().split('T')[0]

      // 1. Create schedule
      const { data: scheduleData, error: sError } = await supabase
        .from('schedules')
        .insert({
          user_id: user.id,
          name: scheduleName,
          type: 'weekly',
          start_date: startDate,
          end_date: endDate,
          color: selectedColor,
          is_active: true,
        })
        .select()
        .single()

      if (sError) throw sError

      // 2. Create 7 schedule days
      const daysToInsert = []
      for (let i = 0; i < 7; i++) {
        const dObj = new Date(today)
        dObj.setDate(dObj.getDate() + i)
        const dStr = dObj.toISOString().split('T')[0]
        const dayOfWeek = dObj.getDay()

        daysToInsert.push({
          schedule_id: scheduleData.id,
          date: dStr,
          day_name: dayNames[dayOfWeek],
          is_completed: false,
          sort_order: i,
        })
      }

      const { data: createdDays, error: dError } = await supabase
        .from('schedule_days')
        .insert(daysToInsert)
        .select()

      if (dError) throw dError

      // 3. If template has default tasks and it's not blank, populate tasks for the days
      if (templateCategory !== 'blank' && createdDays && createdDays.length > 0) {
        const defaultTasksConfig: Record<string, { title: string; start: string; end: string; priority: 'high' | 'medium' | 'low'; color: string }[]> = {
          work: [
            { title: 'مراجعة خطة العمل اليومية', start: '09:00:00', end: '10:00:00', priority: 'high', color: selectedColor },
            { title: 'الرد على استفسارات العملاء والبريد', start: '10:30:00', end: '11:30:00', priority: 'medium', color: '#f59e0b' },
            { title: 'جلسة تركيز عميق 90 دقيقة', start: '12:00:00', end: '13:30:00', priority: 'high', color: selectedColor },
            { title: 'اجتماع مراجعة مؤشرات الأداء', start: '14:30:00', end: '15:30:00', priority: 'medium', color: '#0284c7' },
          ],
          study: [
            { title: 'مراجعة المحاضرات الصباحية', start: '08:30:00', end: '10:30:00', priority: 'high', color: selectedColor },
            { title: 'حل التمارين والواجبات المطلوبة', start: '11:00:00', end: '13:00:00', priority: 'medium', color: '#3b82f6' },
            { title: 'قراءة ومراجعة شاملة لدروس اليوم', start: '16:00:00', end: '17:30:00', priority: 'low', color: '#10b981' },
          ],
          balanced: [
            { title: 'صلاة الفجر وورد الصباح ورياضة خفيفة', start: '05:30:00', end: '06:30:00', priority: 'high', color: '#10b981' },
            { title: 'فترة عمل أو دراسة مركزة', start: '09:00:00', end: '12:30:00', priority: 'high', color: selectedColor },
            { title: 'قراءة وتطوير الذات', start: '15:00:00', end: '16:00:00', priority: 'low', color: '#06b6d4' },
            { title: 'وقت عائلي واستراحة مسائية', start: '19:30:00', end: '21:00:00', priority: 'medium', color: '#f59e0b' },
          ],
        }

        const taskTemplate = defaultTasksConfig[templateCategory] || []
        const tasksToInsert: Array<{
          schedule_day_id: string
          schedule_id: string
          user_id: string
          title: string
          start_time: string
          end_time: string
          priority: 'high' | 'medium' | 'low'
          status: 'not_started'
          is_completed: boolean
          color: string
          sort_order: number
        }> = []

        createdDays.forEach((dayRecord) => {
          taskTemplate.forEach((t, idx) => {
            tasksToInsert.push({
              schedule_day_id: dayRecord.id,
              schedule_id: scheduleData.id,
              user_id: user.id,
              title: t.title,
              start_time: t.start,
              end_time: t.end,
              priority: t.priority,
              status: 'not_started',
              is_completed: false,
              color: t.color,
              sort_order: idx,
            })
          })
        })

        if (tasksToInsert.length > 0) {
          await supabase.from('tasks').insert(tasksToInsert)
        }
      }

      setSuccessMessage('تم إنشاء وتفعيل جدولك الجديد بنجاح من القالب!')

      // Redirect to the newly created schedule
      setTimeout(() => {
        router.push(`/dashboard/schedules/${scheduleData.id}`)
      }, 700)
    } catch (err) {
      console.error('Error applying template:', err)
      alert('حدث خطأ أثناء تطبيق القالب، يرجى المحاولة ثانية.')
    }
  }

  // Paywall check for templates
  if (!isPlanLoading && !canAccessTemplates) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            <span>معرض القوالب الجاهزة</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            اختر قالباً جاهزاً ومدروساً لبدء أسبوعك بإنتاجية عالية دون إضاعة الوقت في التخطيط اليدوي
          </p>
        </div>

        <PaywallLockedCard
          title="معرض القوالب الإنتاجية الجاهزة"
          description="مكتبة القوالب المصممة خصيصاً للعمل والدراسة ونمط الحياة المتوازن بنقرة زر واحدة متاحة لمشتركي فكرتو برو."
          features={[
            'قالب العمل والإنتاجية العالية',
            'قالب الدراسة والتحصيل والامتحانات',
            'قالب الحياة المتوازنة والعادات الإيجابية',
            'إنشاء وتخصيص قوالب متقدمة خاصة بك',
          ]}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-sm font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span>{successMessage}</span>
          </div>
          <span className="text-xs text-teal-400 font-normal">جاري نقلك للجدول...</span>
        </div>
      )}

      {/* Templates Gallery Component */}
      <TemplatesGallery onApplyTemplate={handleApplyTemplate} />
    </div>
  )
}
