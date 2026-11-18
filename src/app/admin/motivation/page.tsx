'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Input, Textarea, Modal, Badge } from '@/components/ui'
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  Volume2,
} from 'lucide-react'
import type { MotivationalContent } from '@/types/database'

export default function AdminMotivationPage() {
  const supabase = createClient()
  const [items, setItems] = useState<MotivationalContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MotivationalContent | null>(null)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState<'nature' | 'cosmic' | 'cinematic' | 'fantasy' | 'mixed'>('cinematic')
  const [quoteAr, setQuoteAr] = useState('')
  const [quoteSubtext, setQuoteSubtext] = useState('')
  const [milestoneTrigger, setMilestoneTrigger] = useState<'start_of_day' | 'progress_50' | 'completed_100' | 'streak' | 'returning' | 'all'>('all')
  const [isActive, setIsActive] = useState(true)
  const [sortOrder, setSortOrder] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load Motivational Items
  const loadContent = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('motivational_content')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Error fetching motivational content:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const handleOpenAdd = () => {
    setEditingItem(null)
    setTitle('')
    setImageUrl('')
    setCategory('cinematic')
    setQuoteAr('')
    setQuoteSubtext('')
    setMilestoneTrigger('all')
    setIsActive(true)
    setSortOrder(items.length + 1)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: MotivationalContent) => {
    setEditingItem(item)
    setTitle(item.title)
    setImageUrl(item.image_url)
    setCategory(item.category)
    setQuoteAr(item.quote_ar)
    setQuoteSubtext(item.quote_subtext || '')
    setMilestoneTrigger(item.milestone_trigger)
    setIsActive(item.is_active)
    setSortOrder(item.sort_order)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('motivational_content')
          .update({
            title,
            image_url: imageUrl,
            category,
            quote_ar: quoteAr,
            quote_subtext: quoteSubtext || null,
            milestone_trigger: milestoneTrigger,
            is_active: isActive,
            sort_order: Number(sortOrder),
          })
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('motivational_content').insert({
          title,
          image_url: imageUrl,
          category,
          quote_ar: quoteAr,
          quote_subtext: quoteSubtext || null,
          milestone_trigger: milestoneTrigger,
          is_active: isActive,
          sort_order: Number(sortOrder),
        })

        if (error) throw error
      }

      await loadContent()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to save motivational item:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه البطاقة التحفيزية؟')) return

    try {
      const { error } = await supabase
        .from('motivational_content')
        .delete()
        .eq('id', id)

      if (error) throw error
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Failed to delete motivational content:', err)
    }
  }

  return (
    <div className="space-y-6 font-cairo text-right">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-500" />
            <span>إدارة المحتوى التحفيزي والصور الملهمة</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            التحكم الكامل في الصور والجمل التحفيزية المعروضة لجميع مستخدمي المنصة وربطها بنسب الإنجاز.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
        >
          <Plus className="w-4 h-4 ml-1.5" />
          <span>إضافة بطاقة تحفيزية جديدة</span>
        </Button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Image Preview Banner */}
            <div
              className="h-44 w-full bg-cover bg-center relative flex flex-col justify-between p-3"
              style={{ backgroundImage: `url('${item.image_url}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md">
                  الترتيب: {item.sort_order}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.is_active
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-600 text-gray-200'
                  }`}
                >
                  {item.is_active ? 'نشط' : 'معطل'}
                </span>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] text-cyan-300 font-bold block">
                  {item.category.toUpperCase()}
                </span>
                <h4 className="text-sm font-black text-white line-clamp-1 drop-shadow">
                  {item.title}
                </h4>
              </div>
            </div>

            {/* Quote details */}
            <div className="p-4 space-y-2 flex-1">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug">
                «{item.quote_ar}»
              </p>
              {item.quote_subtext && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {item.quote_subtext}
                </p>
              )}
              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 dark:border-gray-800">
                <span>محفز الظهور:</span>
                <Badge variant="cyan" size="sm">
                  {item.milestone_trigger}
                </Badge>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenEdit(item)}
                className="text-xs"
              >
                <Edit2 className="w-3.5 h-3.5 ml-1" />
                <span>تعديل</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(item.id)}
                className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5 ml-1" />
                <span>حذف</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'تعديل البطاقة التحفيزية' : 'إضافة بطاقة تحفيزية جديدة'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-right font-cairo">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              عنوان المشهد / الصورة *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: شروق الأمل في قمة الجبل"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              رابط الصورة (Image URL) *
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold"
              >
                <option value="cinematic">سينمائي (Cinematic)</option>
                <option value="cosmic">فضائي كوني (Cosmic)</option>
                <option value="nature">طبيعي (Nature)</option>
                <option value="fantasy">خيالي ملهم (Fantasy)</option>
                <option value="mixed">مختلط (Mixed)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                مستوى الإنجاز المرتبط
              </label>
              <select
                value={milestoneTrigger}
                onChange={(e) => setMilestoneTrigger(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold"
              >
                <option value="all">في جميع الأوقات (All)</option>
                <option value="start_of_day">بداية اليوم (Start of Day)</option>
                <option value="progress_50">عند إنجاز 50%</option>
                <option value="completed_100">عند إتمام 100%</option>
                <option value="streak">سلسلة متواصلة (Streaks)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              الجملة التحفيزية الرئيسية *
            </label>
            <Input
              value={quoteAr}
              onChange={(e) => setQuoteAr(e.target.value)}
              placeholder="أنت أقوى من أعذارك واستمر في رحلتك نحو الأفضل"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              النص التوضيحي الثانوي
            </label>
            <Textarea
              value={quoteSubtext}
              onChange={(e) => setQuoteSubtext(e.target.value)}
              placeholder="كل إنجاز صغير يقربك من النسخة التي تحلم بها."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                ترتيب العرض
              </label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="activeItem"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-0 accent-cyan-600"
              />
              <label htmlFor="activeItem" className="text-xs font-bold text-gray-700 dark:text-gray-300">
                تفعيل البطاقة للمستخدمين
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 text-white font-bold">
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ البطاقة التحفيزية'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
