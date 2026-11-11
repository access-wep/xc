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
  MessageCircle,
  Headphones,
  ExternalLink,
  ShieldCheck,
  Save,
  Check,
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
  const [siteInfoSaveSuccess, setSiteInfoSaveSuccess] = useState(false)

  // WhatsApp Technical Support State
  const [whatsappNumber, setWhatsappNumber] = useState('+966500000000')
  const [whatsappMessage, setWhatsappMessage] = useState('مرحباً، أود الاستفسار وطلب الدعم الفني بخصوص منصة فكرتو')
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [isSavingWhatsApp, setIsSavingWhatsApp] = useState(false)
  const [whatsappSaveSuccess, setWhatsappSaveSuccess] = useState(false)

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
      // 1. Load site settings safely with maybeSingle
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'site_info')
        .maybeSingle()

      if (settings?.value) {
        const val = settings.value as any
        setSiteName(val.site_name || 'فكرتو')
        setSiteNameEn(val.site_name_en || 'Fekrto')
        setSupportEmail(val.contact_email || 'support@fekrto.com')
        setContactPhone(val.contact_phone || '+966500000000')
        setCurrency(val.currency || 'ر.س')

        // WhatsApp settings
        setWhatsappNumber(val.whatsapp_number || val.contact_phone || '+966500000000')
        setWhatsappMessage(
          val.whatsapp_message || 'مرحباً، أود الاستفسار وطلب الدعم الفني بخصوص منصة فكرتو'
        )
        setWhatsappEnabled(val.whatsapp_enabled !== false)
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

  // Resilient helper to update site_settings without unique constraint errors
  const persistSiteSettings = async (partialValues: any) => {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id, value')
      .eq('key', 'site_info')
      .maybeSingle()

    const currentVal = (existing?.value as any) || {}
    const mergedValue = {
      ...currentVal,
      ...partialValues,
    }

    if (existing?.id) {
      const { error } = await supabase
        .from('site_settings')
        .update({
          value: mergedValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert({
          key: 'site_info',
          value: mergedValue,
          description: 'الإعدادات الأساسية للموقع ومعلومات التواصل',
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
    }
  }

  // Save General Site Info
  const handleSaveSiteInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSiteInfo(true)
    setSiteInfoSaveSuccess(false)
    try {
      await persistSiteSettings({
        site_name: siteName,
        site_name_en: siteNameEn,
        contact_email: supportEmail,
        contact_phone: contactPhone,
        currency,
        whatsapp_number: whatsappNumber,
        whatsapp_message: whatsappMessage,
        whatsapp_enabled: whatsappEnabled,
      })

      setSiteInfoSaveSuccess(true)
      setTimeout(() => setSiteInfoSaveSuccess(false), 4000)
    } catch (err: any) {
      console.error('Error saving site info:', err)
      alert(err.message || 'حدث خطأ أثناء حفظ معلومات الموقع والتواصل.')
    } finally {
      setIsSavingSiteInfo(false)
    }
  }

  // Save WhatsApp Support Config Dedicated Handler
  const handleSaveWhatsAppConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingWhatsApp(true)
    setWhatsappSaveSuccess(false)
    try {
      await persistSiteSettings({
        site_name: siteName,
        site_name_en: siteNameEn,
        contact_email: supportEmail,
        contact_phone: contactPhone,
        currency,
        whatsapp_number: whatsappNumber.trim(),
        whatsapp_message: whatsappMessage.trim(),
        whatsapp_enabled: whatsappEnabled,
      })

      setWhatsappSaveSuccess(true)
      setTimeout(() => setWhatsappSaveSuccess(false), 4000)
    } catch (err: any) {
      console.error('Error saving whatsapp settings:', err)
      alert(err.message || 'تعذر حفظ إعدادات الواتساب.')
    } finally {
      setIsSavingWhatsApp(false)
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

  // Clean WhatsApp phone number for preview link
  const cleanPhoneForPreview = whatsappNumber.replace(/[^0-9]/g, '')
  const previewWhatsAppUrl = `https://wa.me/${cleanPhoneForPreview}?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-500" />
          <span>إعدادات الموقع، معلومات التواصل، والدعم الفني</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          تعديل معلومات التواصل والبريد والهاتف ورقم واتساب الدعم الفني والحسابات البنكية المعتمدة
        </p>
      </div>

      {/* 1. General Site & Contact Info Settings */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
          معلومات التواصل والبيانات العامة للمنصة
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          البيانات التي تظهر للزوار في تذييل الموقع وصفحة التواصل واستقبال الرسائل
        </p>

        <form onSubmit={handleSaveSiteInfo} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="اسم الموقع (بالعربية)"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
            />
            <Input
              label="اسم الموقع (بالإنجليزية)"
              value={siteNameEn}
              onChange={(e) => setSiteNameEn(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="بريد الدعم الفني والتواصل الرسمي *"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              required
            />
            <Input
              label="رقم الهاتف العام والتواصل *"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" isLoading={isSavingSiteInfo} className="gap-2">
              <Save className="w-4 h-4" />
              <span>حفظ معلومات التواصل والبيانات</span>
            </Button>

            {siteInfoSaveSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>تم حفظ معلومات التواصل بنجاح!</span>
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* 2. WhatsApp Customer Support Dedicated Section */}
      <Card className="p-6 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>خدمة الدعم الفني عبر واتساب (WhatsApp Support)</span>
                <Badge variant={whatsappEnabled ? 'success' : 'danger'}>
                  {whatsappEnabled ? 'الخدمة مفعّلة في الموقع' : 'الخدمة معطّلة'}
                </Badge>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                تحديد رقم الواتساب الذي يتواصل عليه العملاء للمساعدة وحل مشكلات الدفع والاشتراكات
              </p>
            </div>
          </div>

          {/* Test Link Button */}
          {cleanPhoneForPreview && (
            <a
              href={previewWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/40 hover:bg-emerald-200/70 border border-emerald-300/40 transition-colors shadow-sm self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>تجربة فتح المحادثة الآن</span>
            </a>
          )}
        </div>

        <form onSubmit={handleSaveWhatsAppConfig} className="space-y-4 max-w-3xl">
          {/* Enable / Disable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                إظهار زر واتساب العائم في صفحات الموقع
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                عند تفعيله، سيظهر زر عائم للعملاء في أسفل الشاشة للتواصل المباشر مع الدعم
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                label="رقم واتساب الدعم الفني *"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="مثال: +966500000000 أو 201000000000"
                required
              />
              <p className="text-[10px] text-gray-400 ps-1">
                اكتب الرقم متضمناً كود الدولة الدولي (مثال: 966 للسعودية، 20 لمصر، 971 للإمارات).
              </p>
            </div>

            <div className="space-y-1">
              <Input
                label="الرسالة الافتراضية للمحادثة"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="مثال: مرحباً، أود الاستفسار بخصوص منصة فكرتو"
              />
              <p className="text-[10px] text-gray-400 ps-1">
                الرسالة التي ستظهر مسبقاً في مربع كتابة واتساب عند ضغط العميل على الزر.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSavingWhatsApp}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ إعدادات واتساب الدعم الفني</span>
            </Button>

            {whatsappSaveSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم حفظ إعدادات الواتساب بنجاح، وستنعكس فوراً على الموقع!</span>
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* 3. Payment Methods Management */}
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
