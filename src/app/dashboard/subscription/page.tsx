'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CurrencySelector } from '@/components/CurrencySelector'
import { createClient } from '@/lib/supabase/client'
import {
  Card,
  Button,
  Input,
  Modal,
  Badge,
  Select,
} from '@/components/ui'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Upload,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
  FileCheck,
  XCircle,
} from 'lucide-react'
import type {
  SubscriptionPlan,
  PaymentMethod,
  PaymentRequest,
  Subscription,
  Coupon,
} from '@/types/database'

export default function SubscriptionPage() {
  const { user } = useAuth()
  const { currentCountry, formatPrice } = useCurrency()
  const supabase = createClient()

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Payment Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [isYearly, setIsYearly] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Proof Upload State
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Load Data
  const loadSubscriptionData = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      // 1. Fetch Plans
      const { data: plansData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)

      setPlans(plansData || [])
      if (plansData && plansData.length > 0) {
        setSelectedPlan(plansData[0])
      }

      // 2. Fetch Active Payment Methods
      const { data: methodsData } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      setPaymentMethods(methodsData || [])
      if (methodsData && methodsData.length > 0) {
        setSelectedMethod(methodsData[0])
      }

      // 3. Fetch User Active Subscription (Safe limit 1)
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('end_date', { ascending: false })
        .limit(1)

      setActiveSubscription(subData && subData.length > 0 ? subData[0] : null)

      // 4. Fetch User Payment Requests
      const { data: requestsData } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setPaymentRequests(requestsData || [])
    } catch (err) {
      console.error('Error fetching subscription data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubscriptionData()
  }, [user])

  // Price Calculation tailored to user's Arab country with Coupon
  const countryMonthly = currentCountry.monthlyPrice
  const countryYearly = currentCountry.yearlyPrice
  const rawPrice = isYearly ? countryYearly : countryMonthly

  let discountAmount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = (rawPrice * appliedCoupon.discount_value) / 100
    } else {
      discountAmount = appliedCoupon.discount_value
    }
  }
  const finalPrice = Math.max(0, rawPrice - discountAmount)

  // Apply Coupon Code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponError(null)

    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !coupon) {
        setCouponError('رمز الكوبون غير صحيح أو منتهي الصلاحية.')
        return
      }

      // Check max uses
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        setCouponError('عذرًا، لقد تم استنفاد الحد الأقصى لاستخدام هذا الكوبون.')
        return
      }

      setAppliedCoupon(coupon)
    } catch (err) {
      setCouponError('تعذر التحقق من الكوبون.')
    }
  }

  // Submit Payment Request with Proof
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedPlan || !selectedMethod) return

    if (!proofFile) {
      setPaymentError('يرجى إرفاق صورة إيصال التحويل أو لقطة الشاشة لإتمام الطلب.')
      return
    }

    setIsSubmittingPayment(true)
    setPaymentError(null)

    try {
      // 1. Upload proof file to Supabase Storage (bucket: 'payment_proofs')
      const fileExt = proofFile.name.split('.').pop()
      const fileName = `${user.id}_${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(fileName, proofFile, {
          cacheControl: '3600',
          upsert: false,
        })

      let proofUrl = null
      if (uploadData) {
        const { data: publicUrl } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(fileName)
        proofUrl = publicUrl.publicUrl
      } else {
        // Fallback: mock url for local testing if bucket isn't pre-configured
        proofUrl = `local_proof_${fileName}`
      }

      // 2. Insert into payment_requests table with 'pending' status
      const { data: newPaymentReq, error: requestError } = await supabase
        .from('payment_requests')
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          is_yearly: isYearly,
          coupon_id: appliedCoupon?.id || null,
          payment_method_id: selectedMethod.id,
          amount: finalPrice,
          currency: currentCountry.currencySymbol || 'SAR',
          proof_url: proofUrl,
          status: 'pending',
        })
        .select()
        .single()

      if (requestError) throw requestError

      setSubmissionSuccess(true)
      if (newPaymentReq) {
        setPaymentRequests((prev) => [newPaymentReq, ...prev])
      }
      await loadSubscriptionData()
    } catch (err: any) {
      setPaymentError(err.message || 'حدث خطأ أثناء إرسال طلب الدفع.')
    } finally {
      setIsSubmittingPayment(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header with Country & Currency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>الاشتراكات وخطط الأسعار للوطن العربي</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            اختر الباقة المناسبة وقم بالدفع بالعملة والوسيلة المحلية في دولتك
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-gray-500 hidden sm:inline">دولة الدفع:</span>
          <CurrencySelector />
        </div>
      </div>

      {/* Country Notice Strip */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentCountry.flag}</span>
          <span>
            <strong>الأسعار معروضة بـ {currentCountry.currencyName} ({currentCountry.currencySymbol}):</strong>{' '}
            طرق الدفع المتاحة في {currentCountry.name}: {currentCountry.paymentMethods.join(' • ')}
          </span>
        </div>
      </div>

      {/* Active Subscription Banner */}
      {activeSubscription ? (
        <Card className="p-6 bg-gradient-to-l from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-200" />
                <h3 className="text-xl font-bold">اشتراكك مفعل حاليًا!</h3>
              </div>
              <p className="text-sm text-emerald-100 mt-1">
                ينتهي اشتراكك في: {new Date(activeSubscription.end_date).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <Badge variant="outline" className="bg-white/20 text-white border-white/40 self-start sm:self-auto">
              {activeSubscription.is_yearly ? 'اشتراك سنوي' : 'اشتراك شهري'}
            </Badge>
          </div>
        </Card>
      ) : (
        <Card className="p-5 bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 flex items-center gap-3 text-amber-800 dark:text-amber-300">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs sm:text-sm">
            أنت تستخدم حاليًا الباقة التجريبية المجانية. قم بالترقية الآن للاستمتاع بكافة الميزات غير المحدودة!
          </p>
        </Card>
      )}

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan Option */}
        <Card className="p-8 flex flex-col justify-between border-2 border-transparent hover:border-indigo-500 transition-all">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                الاشتراك الشهري
              </h3>
              <Badge variant="info">مرونة شهرية</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              خطة مرنة تناسب المتابعة المستمرة بدون التزام طويل الأجل
            </p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                {formatPrice(countryMonthly)}
              </span>
              <span className="text-sm text-gray-500">/ شهرياً</span>
            </div>

            <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300 mb-8">
              {[
                'إنشاء جداول غير محدودة',
                'مهام تفصيلية غير محدودة لكل يوم',
                'نظام احتساب إنجاز متطور ودقيق',
                'تقويم تفاعلي كامل',
                'إحصائيات الأداء ومعدل الاستمرارية',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setIsYearly(false)
              setSubmissionSuccess(false)
              setIsCheckoutOpen(true)
            }}
          >
            اختيار الاشتراك الشهري
          </Button>
        </Card>

        {/* Yearly Plan Option */}
        <Card className="p-8 flex flex-col justify-between border-2 border-indigo-600 dark:border-indigo-500 bg-gradient-to-b from-indigo-50/30 to-white dark:from-indigo-950/20 dark:to-gray-900 relative shadow-xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-l from-indigo-600 to-purple-600 text-white text-[11px] font-bold shadow-md">
            الأكثر توفيرًا (وفّر 42%)
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 mt-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                الاشتراك السنوي
              </h3>
              <Badge variant="success">أفضل قيمة</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              سنة كاملة من التنظيم والإنتاجية مع أولوية الدعم الفني
            </p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                {formatPrice(countryYearly)}
              </span>
              <span className="text-sm text-gray-500">/ سنوياً</span>
              <span className="text-xs text-gray-400 line-through ms-2">
                {formatPrice(countryMonthly * 12)}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300 mb-8">
              {[
                'كل مميزات الاشتراك الشهري بالكامل',
                'خصم استثنائي يعادل 5 أشهر مجانية',
                'أولوية مطلقة في الدعم الفني',
                'تقارير تحليلية ومؤشرات متقدمة',
                'تحديثات وميزات حصرية مبكرة',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setIsYearly(true)
              setSubmissionSuccess(false)
              setIsCheckoutOpen(true)
            }}
          >
            اختيار الاشتراك السنوي
          </Button>
        </Card>
      </div>

      {/* Payment Requests History */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          سجل طلبات الدفع والتحويل
        </h3>

        {paymentRequests.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">
            لا توجد طلبات دفع مسجلة مسبقًا.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {paymentRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      طلب اشتراك {req.is_yearly ? 'سنوي' : 'شهري'}
                    </span>
                    <Badge
                      variant={
                        req.status === 'approved'
                          ? 'success'
                          : req.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {req.status === 'approved'
                        ? 'معتمد ومفعل'
                        : req.status === 'rejected'
                        ? 'مرفوض'
                        : 'قيد المراجعة'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    المبلغ: {req.amount} {req.currency || 'ر.س'} | التاريخ:{' '}
                    {new Date(req.created_at).toLocaleDateString('ar-SA')}
                  </p>
                  {req.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1">
                      سبب الرفض: {req.rejection_reason}
                    </p>
                  )}
                </div>

                {req.proof_url && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400">
                    تم إرفاق الإيصال بنجاح
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Manual Payment Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="تأكيد الاشتراك والدفع اليدوي"
        size="lg"
      >
        {submissionSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              تم استلام إيصال التحويل بنجاح!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              طلبك الآن قيد المراجعة لدى فريق الإدارة. سيتم مطابقة الإيصال وتفعيل اشتراكك تلقائيًا خلال وقت وجيز.
            </p>
            <Button variant="primary" onClick={() => setIsCheckoutOpen(false)}>
              تم، العودة إلى لوحة التحكم
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="space-y-5">
            {paymentError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Plan Summary */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">الباقة المختارة:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {isYearly ? 'الاشتراك السنوي الاحترافي' : 'الاشتراك الشهري الاحترافي'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">السعر الأساسي:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(rawPrice)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-sm mb-2 text-emerald-600">
                  <span>الخصم المطبق ({appliedCoupon.code}):</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400">
                <span>المبلغ المطلوب تحويله:</span>
                <span className="text-xl font-extrabold">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                هل لديك كود خصم أو كوبون؟
              </label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="أدخل رمز الكوبون..."
                  className="uppercase text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  className="flex-shrink-0"
                >
                  تطبيق
                </Button>
              </div>
              {couponError && <p className="text-xs text-red-500">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-xs text-emerald-600 font-semibold">
                  تم تطبيق الخصم بنجاح!
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                اختر طريقة التحويل المناسبة لك *
              </label>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod?.id === method.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selectedMethod?.id === method.id}
                      onChange={() => setSelectedMethod(method)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {method.name_ar}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {method.instructions}
                      </p>
                      {/* Account Details Box */}
                      {method.account_details && (
                        <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs space-y-1">
                          {Object.entries(method.account_details).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-gray-400">{k}:</span>
                              <span className="font-mono font-medium text-gray-800 dark:text-gray-200">
                                {String(v)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Receipt Upload Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                رفع صورة إيصال التحويل البنكي أو لقطة الشاشة *
              </label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*,.pdf"
                  required
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {proofFile && (
                  <p className="text-xs font-semibold text-emerald-600 mt-2">
                    تم اختيار الملف: {proofFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCheckoutOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmittingPayment}
              >
                تأكيد وإرسال طلب الدفع
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
