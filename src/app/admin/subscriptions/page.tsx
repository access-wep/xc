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
} from 'lucide-react'
import type { SubscriptionPlan, Coupon, Subscription } from '@/types/database'

export default function AdminSubscriptionsManagementPage() {
  const supabase = createClient()

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Plan Price Edit State
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [monthlyPrice, setMonthlyPrice] = useState<number>(29)
  const [yearlyPrice, setYearlyPrice] = useState<number>(199)
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)

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
        setMonthlyPrice(plansData[0].price_monthly)
        setYearlyPrice(plansData[0].price_yearly)
      }

      // 2. Fetch coupons
      const { data: couponsData } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
      setCoupons(couponsData || [])

      // 3. Fetch recent subscriptions with user details
      const { data: subsData } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(20)
      setSubscriptions(subsData || [])
    } catch (err) {
      console.error('Error loading admin sub data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Update Plan Pricing
  const handleUpdatePrices = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plans || plans.length === 0) return
    setIsUpdatingPlan(true)

    try {
      const plan = plans[0]
      const { error } = await supabase
        .from('subscription_plans')
        .update({
          price_monthly: Number(monthlyPrice),
          price_yearly: Number(yearlyPrice),
          updated_at: new Date().toISOString(),
        })
        .eq('id', plan.id)

      if (error) throw error
      alert('تم تحديث أسعار الاشتراكات بنجاح!')
      loadData()
    } catch (err: any) {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-amber-500" />
          <span>إدارة أسعار الاشتراكات والكوبونات</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          تعديل الأسعار الشهرية والسنوية، إنشاء أكواد الخصم، ومتابعة الاشتراكات
        </p>
      </div>

      {/* Pricing Configuration Card */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          تعديل الأسعار الرسمية للباقات
        </h3>
        <form onSubmit={handleUpdatePrices} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="سعر الاشتراك الشهري (ر.س) *"
              type="number"
              min="1"
              step="0.01"
              required
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(Number(e.target.value))}
            />

            <Input
              label="سعر الاشتراك السنوي (ر.س) *"
              type="number"
              min="1"
              step="0.01"
              required
              value={yearlyPrice}
              onChange={(e) => setYearlyPrice(Number(e.target.value))}
            />
          </div>

          <Button type="submit" variant="primary" isLoading={isUpdatingPlan}>
            حفظ وتطبيق الأسعار الجديدة فورًا
          </Button>
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
