'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Input, Select, Badge, Modal } from '@/components/ui'
import {
  CreditCard,
  Tag,
  Plus,
  Percent,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit,
  Save,
  Check,
  Globe,
  Sparkles,
} from 'lucide-react'
import type { SubscriptionPlan, Coupon, Subscription } from '@/types/database'

export default function AdminSubscriptionsManagementPage() {
  const supabase = createClient()

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Plan Price Edit State
  const [monthlyPrice, setMonthlyPrice] = useState<number>(29)
  const [yearlyPrice, setYearlyPrice] = useState<number>(199)
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState(false)

  // Coupon Creation State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(20)
  const [maxUses, setMaxUses] = useState<number | ''>('')
  const [isSavingCoupon, setIsSavingCoupon] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch plans
      const { data: plansData } = await supabase.from('subscription_plans').select('*')
      setPlans(plansData || [])
      if (plansData && plansData.length > 0) {
        setMonthlyPrice(Number(plansData[0].price_monthly))
        setYearlyPrice(Number(plansData[0].price_yearly))
      }

      // 2. Fetch coupons
      const { data: couponsData } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
      setCoupons(couponsData || [])

      // 3. Fetch recent subscriptions safely (without postgrest cross-schema join)
      const { data: subsData } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (subsData && subsData.length > 0) {
        const userIds = Array.from(new Set(subsData.map((s: any) => s.user_id).filter(Boolean)))
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds)

        const profMap = new Map((profilesData || []).map((p: any) => [p.id, p]))
        const enrichedSubs = subsData.map((s: any) => ({
          ...s,
          profiles: profMap.get(s.user_id) || { full_name: 'مشترك مسجل', email: '' },
        }))
        setSubscriptions(enrichedSubs)
      } else {
        setSubscriptions([])
      }
    } catch (err) {
      console.error('Error loading admin subscription data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Update Plan Pricing - Resilient & Updates site_settings for immediate dynamic currency conversion
  const handleUpdatePrices = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPlan(true)
    setPricingSaveSuccess(false)

    try {
      const mPrice = Number(monthlyPrice) || 29
      const yPrice = Number(yearlyPrice) || 199

      if (plans && plans.length > 0) {
        for (const plan of plans) {
          const { error } = await supabase
            .from('subscription_plans')
            .update({
              price_monthly: mPrice,
              price_yearly: yPrice,
              updated_at: new Date().toISOString(),
            })
            .eq('id', plan.id)

          if (error) throw error
        }
      } else {
        // Create initial plan row if missing
        const { error } = await supabase
          .from('subscription_plans')
          .insert({
            name: 'Pro Plan',
            name_ar: 'الباقة الاحترافية',
            description_ar: 'الوصول الكامل لكافة مميزات منصة فكرتو',
            price_monthly: mPrice,
            price_yearly: yPrice,
            is_active: true,
          })

        if (error) throw error
      }

      // Also save to site_settings under 'pricing_config'
      const { data: existingSetting } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'pricing_config')
        .maybeSingle()

      const pricingValue = {
        base_monthly_sar: mPrice,
        base_yearly_sar: yPrice,
        updated_at: new Date().toISOString(),
      }

      if (existingSetting?.id) {
        await supabase
          .from('site_settings')
          .update({
            value: pricingValue,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSetting.id)
      } else {
        await supabase
          .from('site_settings')
          .insert({
            key: 'pricing_config',
            value: pricingValue,
            description: 'الأسعار الأساسية للاشتراكات في المنصة',
            updated_at: new Date().toISOString(),
          })
      }

      setPricingSaveSuccess(true)
      setTimeout(() => setPricingSaveSuccess(false), 4000)
      loadData()
    } catch (err: any) {
      console.error('Update prices error:', err)
      alert(err.message || 'حدث خطأ أثناء تحديث الأسعار.')
    } finally {
      setIsUpdatingPlan(false)
    }
  }

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    setIsSavingCoupon(true)

    try {
      const { error } = await supabase.from('coupons').insert({
        code: couponCode.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: Number(discountValue),
        max_uses: maxUses ? Number(maxUses) : null,
        is_active: true,
      })

      if (error) throw error

      setIsCouponModalOpen(false)
      setCouponCode('')
      setDiscountValue(20)
      setMaxUses('')
      loadData()
    } catch (err: any) {
      alert(err.message || 'تعذر إضافة الكوبون.')
    } finally {
      setIsSavingCoupon(false)
    }
  }

  // Toggle Coupon Active Status
  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      await supabase
        .from('coupons')
        .update({
          is_active: !coupon.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', coupon.id)
      loadData()
    } catch (err) {
      console.error('Failed to toggle coupon:', err)
    }
  }

  // Live conversion preview ratios based on base 29 SAR
  const mVal = Number(monthlyPrice) || 29
  const yVal = Number(yearlyPrice) || 199
  const mRatio = mVal / 29
  const yRatio = yVal / 199

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-amber-500" />
          <span>إدارة أسعار الاشتراكات والكوبونات</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          تعديل الأسعار الشهرية والسنوية، إنشاء أكواد الخصم، ومتابعة اشتراكات العملاء
        </p>
      </div>

      {/* Pricing Configuration Card */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
          تعديل الأسعار الرسمية للباقات (بالريال السعودي)
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          الأسعار التي تحددها هنا هي الأساس وتنعكس فوراً على كامل صفحات الموقع وتتحول تلقائياً لعملات الدول العربية
        </p>

        <form onSubmit={handleUpdatePrices} className="space-y-5 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="سعر الاشتراك الشهري (ر.س) *"
              type="number"
              min="1"
              step="0.5"
              required
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(Number(e.target.value))}
            />

            <Input
              label="سعر الاشتراك السنوي (ر.س) *"
              type="number"
              min="1"
              step="1"
              required
              value={yearlyPrice}
              onChange={(e) => setYearlyPrice(Number(e.target.value))}
            />
          </div>

          {/* Regional Currency Live Preview Grid */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>معاينة الأسعار المحتسبة في الدول العربية بعد التعديل:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-base">🇸🇦</span>
                <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">السعودية</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-extrabold">{mVal} ر.س / شهري</p>
                <p className="text-[10px] text-gray-400">{yVal} ر.س / سنوي</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-base">🇪🇬</span>
                <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">مصر</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-extrabold">{Math.round(290 * mRatio)} ج.م / شهري</p>
                <p className="text-[10px] text-gray-400">{Math.round(1990 * yRatio)} ج.م / سنوي</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-base">🇦🇪</span>
                <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">الإمارات</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-extrabold">{Math.round(29 * mRatio)} د.إ / شهري</p>
                <p className="text-[10px] text-gray-400">{Math.round(199 * yRatio)} د.إ / سنوي</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-base">🇰🇼</span>
                <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">الكويت</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-extrabold">{(2.5 * mRatio).toFixed(1)} د.ك / شهري</p>
                <p className="text-[10px] text-gray-400">{(16.5 * yRatio).toFixed(1)} د.ك / سنوي</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="primary" isLoading={isUpdatingPlan} className="gap-2">
              <Save className="w-4 h-4" />
              <span>حفظ وتطبيق الأسعار الجديدة فوراً</span>
            </Button>

            {pricingSaveSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>تم تحديث أسعار الباقات وحفظها بنجاح في المنصة!</span>
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Coupons Management Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-500" />
              <span>أكواد الخصم والكوبونات ({coupons.length})</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              تحديد نسب الخصم ومراقبة عدد مرات الاستخدام
            </p>
          </div>

          <Button
            onClick={() => setIsCouponModalOpen(true)}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كود خصم جديد</span>
          </Button>
        </div>

        {coupons.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">
            لا توجد كوبونات خصم منشأة حاليًا.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-end text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-2.5 px-3 text-start">الكود</th>
                  <th className="py-2.5 px-3 text-start">قيمة الخصم</th>
                  <th className="py-2.5 px-3 text-start">الاستخدام</th>
                  <th className="py-2.5 px-3 text-start">الحالة</th>
                  <th className="py-2.5 px-3 text-center">التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.code}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {c.discount_type === 'percentage'
                        ? `${c.discount_value}%`
                        : `${c.discount_value} ر.س`}
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {c.used_count} {c.max_uses ? `من ${c.max_uses}` : '(غير محدود)'}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={c.is_active ? 'success' : 'danger'}>
                        {c.is_active ? 'فعال' : 'معطل'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button
                        variant={c.is_active ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={() => handleToggleCoupon(c)}
                      >
                        {c.is_active ? 'تعطيل' : 'تفعيل'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Subscriptions List */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          أحدث الاشتراكات الصادرة ({subscriptions.length})
        </h3>

        {subscriptions.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">
            لا توجد اشتراكات نشطة مسجلة حتى الآن.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-end text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-2.5 px-3 text-start">المشترك</th>
                  <th className="py-2.5 px-3 text-start">النوع والمبلغ</th>
                  <th className="py-2.5 px-3 text-start">تاريخ الانتهاء</th>
                  <th className="py-2.5 px-3 text-start">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {subscriptions.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {s.profiles?.full_name || 'غير معروف'}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {s.profiles?.email}
                      </p>
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      {s.amount_paid} ر.س ({s.is_yearly ? 'سنوي' : 'شهري'})
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {new Date(s.end_date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={s.status === 'active' ? 'success' : 'outline'}>
                        {s.status === 'active' ? 'نشط' : 'منتهي'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Coupon Modal */}
      <Modal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        title="إنشاء كود خصم جديد"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="رمز الكود (بالأحرف اللاتينية) *"
            required
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="مثال: FEKRTO50"
            className="uppercase font-mono font-bold"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="نوع الخصم"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              options={[
                { value: 'percentage', label: 'نسبة مئوية (%)' },
                { value: 'fixed', label: 'مبلغ ثابت (ر.س)' },
              ]}
            />

            <Input
              label="قيمة الخصم *"
              type="number"
              min="1"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
            />
          </div>

          <Input
            label="الحد الأقصى لمرات الاستخدام (اتركه فارغاً للاستخدام غير المحدود)"
            type="number"
            min="1"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value ? Number(e.target.value) : '')}
            placeholder="مثال: 100"
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCouponModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" isLoading={isSavingCoupon}>
              إنشاء الكوبون
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
