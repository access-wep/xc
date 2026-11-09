'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Input, Textarea, Badge } from '@/components/ui'
import { FileText, Save, CheckCircle2 } from 'lucide-react'
import type { LegalPage } from '@/types/database'

export default function AdminLegalPagesPage() {
  const supabase = createClient()

  const [pages, setPages] = useState<LegalPage[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>('terms')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const loadLegalPages = async () => {
    try {
      const { data } = await supabase.from('legal_pages').select('*')
      if (data && data.length > 0) {
        setPages(data)
        const current = data.find((p) => p.slug === selectedSlug) || data[0]
        setSelectedSlug(current.slug)
        setTitle(current.title)
        setContent(current.content)
      }
    } catch (err) {
      console.error('Error fetching legal pages:', err)
    }
  }

  useEffect(() => {
    loadLegalPages()
  }, [])

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug)
    setSaveSuccess(false)
    const page = pages.find((p) => p.slug === slug)
    if (page) {
      setTitle(page.title)
      setContent(page.content)
    }
  }

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const { error } = await supabase
        .from('legal_pages')
        .upsert({
          slug: selectedSlug,
          title,
          content,
          is_published: true,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setSaveSuccess(true)
      loadLegalPages()
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ الصفحة.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-500" />
          <span>إدارة وتحرير محتوى الصفحات القانونية</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          تعديل نصوص شروط الاستخدام، سياسات الخصوصية، الاسترداد، والأسئلة الشائعة
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { slug: 'terms', label: 'شروط الاستخدام' },
          { slug: 'privacy', label: 'سياسة الخصوصية' },
          { slug: 'refund-policy', label: 'سياسة الاسترداد' },
          { slug: 'about', label: 'من نحن' },
          { slug: 'disclaimer', label: 'إخلاء المسؤولية' },
          { slug: 'faq', label: 'الأسئلة الشائعة' },
        ].map((tab) => (
          <button
            key={tab.slug}
            onClick={() => handleSelectPage(tab.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedSlug === tab.slug
                ? 'bg-amber-500 text-gray-950 font-bold shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor Card */}
      <Card className="p-6">
        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>تم حفظ الصفحة ونشر التعديلات بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleSavePage} className="space-y-4">
          <Input
            label="عنوان الصفحة *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
              محتوى الصفحة (يدعم تنسيق Markdown) *
            </label>
            <textarea
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-xs font-mono leading-relaxed text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" variant="primary" isLoading={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              <span>حفظ وتحديث المحتوى في الموقع</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
