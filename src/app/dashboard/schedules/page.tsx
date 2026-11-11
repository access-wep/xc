'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card, Modal, Select, Textarea, Badge } from '@/components/ui'
import {
  CalendarDays,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react'
import type { Schedule, ScheduleType } from '@/types/database'

function SchedulesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { isPro, maxSchedules } = usePlanFeatures()
  const supabase = createClient()

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showLimitModal, setShowLimitModal] = useState(false)

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<Schedule | null>(null)
  const [isDeleting, setIsDeleting] = useState<Schedule | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ScheduleType>('weekly')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [color, setColor] = useState('#4f46e5')

  // Check URL param ?create=true
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsCreateModalOpen(true)
    }
  }, [searchParams])

  // Automatically compute end date when type or startDate changes
  useEffect(() => {
    if (!startDate) return
    const start = new Date(startDate)
    const end = new Date(start)

    if (type === 'daily') {
      // Same day
      setEndDate(startDate)
    } else if (type === 'weekly') {
      // +6 days (total 7 days)
      end.setDate(end.getDate() + 6)
      setEndDate(end.toISOString().split('T')[0])
    } else if (type === 'monthly') {
      // 1 month
      end.setMonth(end.getMonth() + 1)
      end.setDate(end.getDate() - 1)
      setEndDate(end.toISOString().split('T')[0])
    } else if (type === 'yearly') {
      // 1 year
      end.setFullYear(end.getFullYear() + 1)
      end.setDate(end.getDate() - 1)
      setEndDate(end.toISOString().split('T')[0])
    }
  }, [type, startDate])

  // Fetch Schedules
  const fetchSchedules = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSchedules(data || [])
    } catch (err) {
      console.error('Error fetching schedules:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [user])

  // Reset form
  const resetForm = () => {
    setName('')
    setDescription('')
    setType('weekly')
    setStartDate(new Date().toISOString().split('T')[0])
    setColor('#4f46e5')
    setIsEditing(null)
  }

  // Handle Save (Create or Update)
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSubmitting(true)

    try {
      if (isEditing) {
        // Update existing schedule
        const { error } = await supabase
          .from('schedules')
          .update({
            name,
            description,
            type,
            start_date: startDate,
            end_date: endDate,
            color,
            updated_at: new Date().toISOString(),
          })
          .eq('id', isEditing.id)

        if (error) throw error
      } else {
        // 1. Insert new schedule
        const { data: newSchedule, error: scheduleError } = await supabase
          .from('schedules')
          .insert({
            user_id: user.id,
            name,
            description,
            type,
            start_date: startDate,
            end_date: endDate,
            color,
            is_active: true,
          })
          .select()
          .single()

        if (scheduleError) throw scheduleError

        // 2. Automatically generate schedule_days
        const start = new Date(startDate)
        const end = new Date(endDate)
        const daysToInsert = []
        let current = new Date(start)
        let order = 1

        while (current <= end) {
          const dateStr = current.toISOString().split('T')[0]
          const dayNameArabic = new Intl.DateTimeFormat('ar-SA', {
            weekday: 'long',
          }).format(current)

          daysToInsert.push({
            schedule_id: newSchedule.id,
            date: dateStr,
            day_name: dayNameArabic,
            is_completed: false,
            sort_order: order++,
          })
          current.setDate(current.getDate() + 1)
        }

        if (daysToInsert.length > 0) {
          const { error: daysError } = await supabase
            .from('schedule_days')
            .insert(daysToInsert)

          if (daysError) console.error('Failed to create schedule days:', daysError)
        }
      }

      setIsCreateModalOpen(false)
      resetForm()
      fetchSchedules()
    } catch (err) {
      console.error('Error saving schedule:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open Create Modal with Limit Check
  const handleOpenCreateModal = () => {
    if (!isPro && schedules.length >= maxSchedules) {
      setShowLimitModal(true)
      return
    }
    resetForm()
    setIsCreateModalOpen(true)
  }

  // Clone / Duplicate Schedule
  const handleDuplicate = async (schedule: Schedule) => {
    if (!user) return
    if (!isPro && schedules.length >= maxSchedules) {
      setShowLimitModal(true)
      return
    }
    try {
      // 1. Create cloned schedule
      const { data: cloned, error: cloneError } = await supabase
        .from('schedules')
        .insert({
          user_id: user.id,
          name: `${schedule.name} (نسخة)`,
          description: schedule.description,
          type: schedule.type,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          color: schedule.color,
          is_active: true,
        })
        .select()
        .single()

      if (cloneError) throw cloneError

      // 2. Fetch original schedule days and tasks to replicate
      const { data: origDays } = await supabase
        .from('schedule_days')
        .select('*, tasks(*)')
        .eq('schedule_id', schedule.id)

      if (origDays && origDays.length > 0) {
        for (const day of origDays) {
          const { data: newDay } = await supabase
            .from('schedule_days')
            .insert({
              schedule_id: cloned.id,
              date: day.date,
              day_name: day.day_name,
              is_completed: false,
              sort_order: day.sort_order,
            })
            .select()
            .single()

          if (newDay && day.tasks && day.tasks.length > 0) {
            const newTasks = day.tasks.map((t: any) => ({
              schedule_day_id: newDay.id,
              schedule_id: cloned.id,
              user_id: user.id,
              title: t.title,
              description: t.description,
              start_time: t.start_time,
              end_time: t.end_time,
              duration_minutes: t.duration_minutes,
              priority: t.priority,
              status: 'not_started',
              is_completed: false,
              notes: t.notes,
              sort_order: t.sort_order,
            }))

            await supabase.from('tasks').insert(newTasks)
          }
        }
      }

      fetchSchedules()
    } catch (err) {
      console.error('Error duplicating schedule:', err)
    }
  }

  // Delete Schedule
  const handleDelete = async () => {
    if (!isDeleting) return
    try {
      await supabase.from('schedules').delete().eq('id', isDeleting.id)
      setIsDeleting(null)
      fetchSchedules()
    } catch (err) {
      console.error('Error deleting schedule:', err)
    }
  }

  // Open Edit Modal
  const openEdit = (schedule: Schedule) => {
    setIsEditing(schedule)
    setName(schedule.name)
    setDescription(schedule.description || '')
    setType(schedule.type)
    setStartDate(schedule.start_date)
    setEndDate(schedule.end_date)
    setColor(schedule.color || '#4f46e5')
    setIsCreateModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <span>نظام إدارة الجداول</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            أنشئ ونظّم جداولك اليومية والأسبوعية والشهرية بحرية كاملة
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          variant="primary"
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء جدول جديد</span>
        </Button>
      </div>

      {/* Free Plan Schedule Limit Banner */}
      {!isPro && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">
              أنت تستخدم الباقة المجانية: قمت بإنشاء <strong>{schedules.length}</strong> من أصل <strong>{maxSchedules}</strong> جدول مسموح به.
            </span>
          </div>
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>ترقية إلى برو لجداول غير محدودة</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      )}

      {/* Schedules Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-500">جاري تحميل الجداول...</div>
      ) : schedules.length === 0 ? (
        <Card className="text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            لم تقم بإنشاء أي جدول حتى الآن
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            الجداول تساعدك في رسم خارطة زمنية دقيقة لمهامك وتوزيعها على الأيام بمرونة وسهولة.
          </p>
          <Button
            onClick={handleOpenCreateModal}
            variant="primary"
          >
            إنشاء أول جدول الآن
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <Card
              key={schedule.id}
              className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border-t-4"
              style={{ borderTopColor: schedule.color || '#4f46e5' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="info">
                    {schedule.type === 'daily'
                      ? 'جدول يومي'
                      : schedule.type === 'weekly'
                      ? 'جدول أسبوعي'
                      : schedule.type === 'monthly'
                      ? 'جدول شهري'
                      : schedule.type === 'yearly'
                      ? 'جدول سنوي'
                      : 'فترة مخصصة'}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(schedule)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      title="نسخ الجدول"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(schedule)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsDeleting(schedule)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                  {schedule.name}
                </h3>
                {schedule.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {schedule.description}
                  </p>
                )}

                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>البداية: {schedule.start_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>النهاية: {schedule.end_date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href={`/dashboard/schedules/${schedule.id}`}
                  className="flex items-center justify-between w-full py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                >
                  <span>عرض تفاصيل المهام والأيام</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Schedule Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          resetForm()
        }}
        title={isEditing ? 'تعديل الجدول' : 'إنشاء جدول جديد'}
        description="حدد تفاصيل الجدول والفترة الزمنية لتوليد الأيام تلقائيًا"
      >
        <form onSubmit={handleSaveSchedule} className="space-y-4">
          <Input
            label="اسم الجدول *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: جدول دراسة شهر نوفمبر، روتين العمل اليومي..."
          />

          <Select
            label="نوع الجدول *"
            value={type}
            onChange={(e) => setType(e.target.value as ScheduleType)}
            options={[
              { value: 'daily', label: 'جدول يومي (يوم واحد)' },
              { value: 'weekly', label: 'جدول أسبوعي (7 أيام)' },
              { value: 'monthly', label: 'جدول شهري (30 يومًا)' },
              { value: 'yearly', label: 'جدول سنوي (سنة كاملة)' },
              { value: 'custom', label: 'فترة مخصصة (تحديد البداية والنهاية)' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تاريخ البداية *"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              label="تاريخ النهاية *"
              type="date"
              required
              disabled={type !== 'custom'}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Textarea
            label="وصف أو ملاحظات للجدول"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أهداف هذا الجدول، التركيز الأساسي..."
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              {isEditing ? 'حفظ التعديلات' : 'توليد وإنشاء الجدول'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        title="تأكيد حذف الجدول"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          هل أنت متأكد من رغبتك في حذف جدول{' '}
          <strong className="text-gray-900 dark:text-white">
            {isDeleting?.name}
          </strong>
          ؟ سيتم حذف جميع الأيام والمهام التابعة له بشكل نهائي.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleting(null)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            تأكيد الحذف
          </Button>
        </div>
      </Modal>

      {/* Schedule Limit Paywall Modal */}
      <Modal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        title="بلغت الحد الأقصى للجداول في الباقة المجانية"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white">
              حد الباقة المجانية: {maxSchedules} جدول فقط
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
              لقد قمت بإنشاء {schedules.length} من أصل {maxSchedules} جدول مسموح به. للتمتع بإنشاء عدد غير محدود من الجداول ومتابعة العادات الشهرية والتحليلات، اشترك الآن في باقة فكرتو برو.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-start text-xs space-y-2 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>جداول غير محدودة دون قيود</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>متابعة العادات الشهرية وسلسلة الالتزام</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>تصدير وطباعة الجداول PDF</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowLimitModal(false)}>
              إلغاء
            </Button>
            <Link href="/dashboard/subscription">
              <Button variant="primary" className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600">
                <Sparkles className="w-4 h-4" />
                <span>الترقية إلى فكرتو برو الآن</span>
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function SchedulesPage() {
  return (
    <React.Suspense fallback={<div className="text-center py-20 text-gray-500">جاري تحميل الجداول...</div>}>
      <SchedulesContent />
    </React.Suspense>
  )
}
