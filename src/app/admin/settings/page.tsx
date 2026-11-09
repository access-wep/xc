'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Input, Textarea, Badge, Modal } from '@/components/ui'
import {
  Settings,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react'
import type { PaymentMethod } from '@/types/database'

export default function AdminSettingsPage() {
  const supabase = createClient()

  // Site Info State
  const [siteName, setSiteName] = useState('فكرتو')
  const [siteNameEn, setSiteNameEn] = useState('Fekrto')
  const [supportEmail, setSupportEmail] = useState('support@fekrto.com')
  const [contactPhone, setContactPhone] = useState('+966500000000')
  const [currency, setCurrency] = useState('ر.س')
  const [isSavingSiteInfo, setIsSavingSiteInfo] = useState(false)

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [methodNameAr, setMethodNameAr] = useState('')
  const [methodNameEn, setMethodNameEn] = useState('')
  const [instructions, setInstructions] = useState('')
  const [accountDetailsRaw, setAccountDetailsRaw] = useState('')
  const [isSavingMethod, setIsSavingMethod] = useState(false)

  const loadSettingsAndMethods = async () => {
    try {
      // 1. Load site settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'site_info')
        .single()

      if (settings?.value) {
        const val = settings.value as any
        setSiteName(val.site_name || 'فكرتو')
        setSiteNameEn(val.site_name_en || 'Fekrto')
        setSupportEmail(val.contact_email || 'support@fekrto.com')
        setContactPhone(val.contact_phone || '+966500000000')
        setCurrency(val.currency || 'ر.س')
      }

      // 2. Load payment methods
      const { data: methods } = await supabase
        .from('payment_methods')
        .select('*')
        .order('sort_order', { ascending: true })

      setPaymentMethods(methods || [])
    } catch (err) {
      console.error('Error loading settings:', err)
    }
  }

  useEffect(() => {
    loadSettingsAndMethods()
  }, [])

  // Save Site Info
  const handleSaveSiteInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSiteInfo(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'site_info',
          value: {
            site_name: siteName,
            site_name_en: siteNameEn,
            contact_email: supportEmail,
            contact_phone: contactPhone,
            currency,
          },
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      alert('تم حفظ إعدادات الموقع بنجاح!')
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ الإعدادات.')
    } finally {
      setIsSavingSiteInfo(false)
    }
  }

  // Toggle Payment Method
  const handleToggleMethod = async (method: PaymentMethod) => {
    try {
      await supabase
        .from('payment_methods')
        .update({
          is_active: !method.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', method.id)

      loadSettingsAndMethods()
    } catch (err) {
      console.error('Failed to toggle method:', err)
    }
  }

  // Open Edit Method Modal
  const openEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method)
    setMethodNameAr(method.name_ar)
    setMethodNameEn(method.name)
    setInstructions(method.instructions || '')
    setAccountDetailsRaw(
      method.account_details ? JSON.stringify(method.account_details, null, 2) : ''
    )
    setIsMethodModalOpen(true)
  }

  // Save Method
  const handleSaveMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingMethod(true)

    try {
      let parsedDetails = {}
      if (accountDetailsRaw.trim()) {
        try {
          parsedDetails = JSON.parse(accountDetailsRaw)
        } catch (e) {
          alert('يرجى التأكد من كتابة تفاصيل الحساب بتنسيق JSON صحيح أو تركها فارغة.')
          setIsSavingMethod(false)
          return
        }
      }

      if (editingMethod) {
        await supabase
          .from('payment_methods')
          .update({
            name: methodNameEn,
            name_ar: methodNameAr,
            instructions,
            account_details: parsedDetails,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingMethod.id)
      } else {
        await supabase.from('payment_methods').insert({
          name: methodNameEn,
          name_ar: methodNameAr,
          instructions,
          account_details: parsedDetails,
          is_active: true,
          sort_order: paymentMethods.length + 1,
        })
      }

      setIsMethodModalOpen(false)
      setEditingMethod(null)
      loadSettingsAndMethods()
    } catch (err: any) {
      alert(err.message || 'تعذر حفظ طريقة الدفع.')
    } finally {
      setIsSavingMethod(false)
    }
  }

  // Delete Method
  const handleDeleteMethod = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف طريقة الدفع هذه؟')) return
    try {
      await supabase.from('payment_methods').delete().eq('id', id)
      loadSettingsAndMethods()
    } catch (err) {
      console.error('Failed to delete method:', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-500" />
          <span>إعدادات الموقع وطرق التحويل والدفع</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          تعديل البيانات الأساسية، البريد، الحسابات البنكية، والمحافظ الرقمية المعتمدة
        </p>
      </div>

      {/* General Settings */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          البيانات العامة للمنصة
        </h3>
        <form onSubmit={handleSaveSiteInfo} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="اسم الموقع (بالعربية)"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <Input
              label="اسم الموقع (بالإنجليزية)"
              value={siteNameEn}
              onChange={(e) => setSiteNameEn(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="بريد الدعم الفني"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
            <Input
              label="رقم التواصل واتساب / هاتف"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" isLoading={isSavingSiteInfo}>
              حفظ بيانات الموقع
            </Button>
          </div>
        </form>
      </Card>

      {/* Payment Methods Management */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" />
              <span>طرق الدفع والتحويل البنكي ({paymentMethods.length})</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              إضافة وتعديل بيانات الحسابات والآيبان والمحافظ الرقمية
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingMethod(null)
              setMethodNameAr('')
              setMethodNameEn('')
              setInstructions('')
              setAccountDetailsRaw('{\n  "اسم البنك": "مصرف الراجحي",\n  "الآيبان": "SA..."\n}')
              setIsMethodModalOpen(true)
            }}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طريقة دفع جديدة</span>
          </Button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {m.name_ar} ({m.name})
                  </h4>
                  <Badge variant={m.is_active ? 'success' : 'danger'}>
                    {m.is_active ? 'نشط' : 'معطل'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1 max-w-xl">
                  {m.instructions}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditMethod(m)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant={m.is_active ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => handleToggleMethod(m)}
                >
                  {m.is_active ? 'تعطيل' : 'تفعيل'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteMethod(m.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal for Add / Edit Payment Method */}
      <Modal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
        title={editingMethod ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع وتحويل'}
        size="lg"
      >
        <form onSubmit={handleSaveMethod} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="الاسم بالعربية *"
              required
              value={methodNameAr}
              onChange={(e) => setMethodNameAr(e.target.value)}
              placeholder="مثال: تحويل بنك الراجحي"
            />
            <Input
              label="الاسم بالإنجليزية *"
              required
              value={methodNameEn}
              onChange={(e) => setMethodNameEn(e.target.value)}
              placeholder="مثال: Al Rajhi Bank Transfer"
            />
          </div>

          <Textarea
            label="تعليمات الدفع والتحويل للمشترك"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="اكتب التعليمات التي ستظهر للمستخدم عند اختيار هذه الطريقة..."
          />

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              بيانات الحساب البنكي / المحفظة (بتنسيق JSON)
            </label>
            <textarea
              rows={4}
              value={accountDetailsRaw}
              onChange={(e) => setAccountDetailsRaw(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-xs font-mono text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMethodModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" isLoading={isSavingMethod}>
              حفظ طريقة الدفع
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
