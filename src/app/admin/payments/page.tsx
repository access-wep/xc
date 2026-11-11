'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Badge, Modal, Textarea, Input } from '@/components/ui'
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import type { PaymentRequest } from '@/types/database'

export default function AdminPaymentsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [requests, setRequests] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Safe proof URL resolver
  const resolveProofUrl = (url: string | null) => {
    if (!url) return null
    if (url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    if (!url.startsWith('local_proof_')) {
      const { data } = supabase.storage.from('payment_proofs').getPublicUrl(url)
      if (data?.publicUrl) return data.publicUrl
    }
    return url
  }

  // Review & Action Modal
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Load All Payment Requests with User Profile details safely
  const loadPaymentRequests = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data: rawRequests, error: reqError } = await query
      if (reqError) {
        console.error('Error fetching raw payment requests:', reqError)
        throw reqError
      }

      if (!rawRequests || rawRequests.length === 0) {
        setRequests([])
        return
      }

      // Safely collect foreign keys for manual hydration
      const userIds = Array.from(new Set(rawRequests.map((r: any) => r.user_id).filter(Boolean)))
      const methodIds = Array.from(new Set(rawRequests.map((r: any) => r.payment_method_id).filter(Boolean)))
      const planIds = Array.from(new Set(rawRequests.map((r: any) => r.plan_id).filter(Boolean)))

      const [profilesRes, methodsRes, plansRes] = await Promise.all([
        userIds.length > 0
          ? supabase.from('profiles').select('id, full_name, email, phone').in('id', userIds)
          : Promise.resolve({ data: [] }),
        methodIds.length > 0
          ? supabase.from('payment_methods').select('id, name_ar, name_en').in('id', methodIds)
          : Promise.resolve({ data: [] }),
        planIds.length > 0
          ? supabase.from('subscription_plans').select('id, name_ar, name_en').in('id', planIds)
          : Promise.resolve({ data: [] }),
      ])

      const profilesMap = new Map((profilesRes.data || []).map((p: any) => [p.id, p]))
      const methodsMap = new Map((methodsRes.data || []).map((m: any) => [m.id, m]))
      const plansMap = new Map((plansRes.data || []).map((pl: any) => [pl.id, pl]))

      const enriched = rawRequests.map((r: any) => ({
        ...r,
        profiles: profilesMap.get(r.user_id) || {
          full_name: 'مستخدم مسجل',
          email: 'غير متوفر',
          phone: '',
        },
        payment_methods: methodsMap.get(r.payment_method_id) || {
          name_ar: 'تحويل بنكي / يدوي',
        },
        subscription_plans: plansMap.get(r.plan_id) || {
          name_ar: r.is_yearly ? 'الاشتراك السنوي' : 'الاشتراك الشهري',
        },
      }))

      setRequests(enriched)
    } catch (err) {
      console.error('Error fetching payments:', err)
      setRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPaymentRequests()
  }, [filterStatus])

  // Approve Payment -> Automatically activates subscription!
  const handleApprove = async () => {
    if (!selectedRequest || !user) return
    setIsProcessing(true)

    try {
      // 1. Calculate subscription duration (1 month or 1 year)
      const startDate = new Date()
      const endDate = new Date(startDate)
      if (selectedRequest.is_yearly) {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      // 2. Create or activate the subscription in public.subscriptions
      const { data: newSub, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: selectedRequest.user_id,
          plan_id: selectedRequest.plan_id,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_yearly: selectedRequest.is_yearly,
          amount_paid: selectedRequest.amount,
          coupon_id: selectedRequest.coupon_id,
        })
        .select()
        .single()

      if (subError) throw subError

      // 3. Update payment_request status to 'approved'
      const { error: reqError } = await supabase
        .from('payment_requests')
        .update({
          status: 'approved',
          subscription_id: newSub.id,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_note: adminNote || 'تم التحقق من التحويل وتفعيل الاشتراك.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedRequest.id)

      if (reqError) throw reqError

      // 4. Create Notification for user
      await supabase.from('notifications').insert({
        user_id: selectedRequest.user_id,
        title: 'تم قبول وتفعيل اشتراكك بنجاح! 🎉',
        message: `تمت مراجعة إيصال الدفع واعتماده بنجاح. اشتراكك نشط الآن حتى ${endDate.toLocaleDateString('ar-SA')}.`,
        type: 'subscription_approved',
        action_url: '/dashboard/subscription',
      })

      setSelectedRequest(null)
      loadPaymentRequests()
    } catch (err: any) {
      console.error('Failed to approve payment:', err)
      alert(err.message || 'حدث خطأ أثناء قبول الطلب.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Reject Payment with Reason
  const handleReject = async () => {
    if (!selectedRequest || !user) return
    if (!rejectionReason.trim()) {
      alert('يرجى توضيح سبب الرفض للمستخدم.')
      return
    }

    setIsProcessing(true)

    try {
      const { error: reqError } = await supabase
        .from('payment_requests')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_note: adminNote || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedRequest.id)

      if (reqError) throw reqError

      // Create Notification for user
      await supabase.from('notifications').insert({
        user_id: selectedRequest.user_id,
        title: 'تعذر قبول إيصال الدفع الخاص بك',
        message: `تم رفض إيصال التحويل للسبب التالي: ${rejectionReason}. يمكنك إعادة المحاولة برفع إيصال صحيح.`,
        type: 'subscription_rejected',
        action_url: '/dashboard/subscription',
      })

      setSelectedRequest(null)
      setRejectionReason('')
      loadPaymentRequests()
    } catch (err: any) {
      console.error('Failed to reject payment:', err)
      alert(err.message || 'حدث خطأ أثناء رفض الطلب.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-amber-500" />
            <span>إدارة ومراجعة طلبات الدفع اليدوي</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            مراجعة إثباتات التحويل، اعتماد الاشتراكات تلقائيًا، وإبداء أسباب الرفض
          </p>
        </div>

        {/* Actions & Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPaymentRequests}
            isLoading={isLoading}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 ms-1" />
            <span>تحديث</span>
          </Button>

          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === s
                    ? 'bg-amber-500 text-gray-950 font-bold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {s === 'all'
                  ? 'الكل'
                  : s === 'pending'
                  ? 'معلقة'
                  : s === 'approved'
                  ? 'معتمدة'
                  : 'مرفوضة'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500 text-xs">
            جاري تحميل طلبات الدفع...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xs">
            لا توجد طلبات دفع متطابقة مع التصفية الحالية.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-end text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-start">المستخدم</th>
                  <th className="py-3 px-4 text-start">الباقة والمبلغ</th>
                  <th className="py-3 px-4 text-start">طريقة التحويل</th>
                  <th className="py-3 px-4 text-start">التاريخ</th>
                  <th className="py-3 px-4 text-start">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {req.profiles?.full_name || 'غير معروف'}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {req.profiles?.email}
                      </p>
                      {req.profiles?.phone && (
                        <p className="text-[10px] text-gray-400 font-mono">
                          {req.profiles.phone}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {req.amount} {req.currency || 'ر.س'}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {req.subscription_plans?.name_ar || (req.is_yearly ? 'اشتراك سنوي' : 'اشتراك شهري')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                      {req.payment_methods?.name_ar || 'تحويل بنكي'}
                    </td>

                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(req.created_at).toLocaleDateString('ar-SA')}
                    </td>

                    <td className="py-3.5 px-4">
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
                          ? 'معتمد'
                          : req.status === 'rejected'
                          ? 'مرفوض'
                          : 'بانتظار المراجعة'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(req)
                          setRejectionReason(req.rejection_reason || '')
                          setAdminNote(req.admin_note || '')
                        }}
                      >
                        فحص الإثبات
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="مراجعة وتأكيد طلب الدفع"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-5">
            {/* User & Request Info Box */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">اسم المشترك:</span>
                <span className="font-bold">{selectedRequest.profiles?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">البريد الإلكتروني:</span>
                <span className="font-mono">{selectedRequest.profiles?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ المطلوب اعتماده:</span>
                <span className="font-black text-indigo-600 text-sm">{selectedRequest.amount} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">نوع الباقة:</span>
                <span className="font-semibold">{selectedRequest.is_yearly ? 'سنوي (365 يوم)' : 'شهري (30 يوم)'}</span>
              </div>
            </div>

            {/* Proof Image Box with Resilient Base64 & Storage Support */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                صورة إيصال التحويل البنكي المرفق:
              </label>

              {(() => {
                const displayUrl = resolveProofUrl(selectedRequest.proof_url)
                const isLocalMock = selectedRequest.proof_url?.startsWith('local_proof_')

                if (!displayUrl || isLocalMock) {
                  return (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs">
                      <p className="font-bold flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>إيصال مسجل محلياً أو غير مرفق</span>
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        {isLocalMock
                          ? `اسم الملف المسجل: ${selectedRequest.proof_url}. تم إرسال هذا الطلب قبل تحديث مشفر الصور المباشر.`
                          : 'لم يقم العميل بإرفاق صورة إيصال لهذا الطلب.'}
                      </p>
                    </div>
                  )
                }

                return (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900/40 p-2">
                      <img
                        src={displayUrl}
                        alt="إيصال التحويل البنكي"
                        className="max-h-80 w-auto object-contain rounded-lg shadow-sm hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                        onClick={() => window.open(displayUrl, '_blank')}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                      <span>اضغط على الصورة لفتحها بالحجم الكامل</span>
                      <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح / تحميل الإيصال الأصلي</span>
                      </a>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Admin Note / Rejection Reason Input */}
            {selectedRequest.status === 'pending' && (
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <Input
                  label="سبب الرفض (مطلوب فقط في حالة رفض الطلب)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="مثال: رقم الحوالة غير مطابق، الإيصال غير واضح..."
                />

                <Input
                  label="ملاحظة إدارية داخلية (اختياري)"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="ملاحظات للفريق الداخلي..."
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedRequest(null)}
              >
                إغلاق
              </Button>

              {selectedRequest.status === 'pending' && (
                <>
                  <Button
                    type="button"
                    variant="danger"
                    isLoading={isProcessing}
                    onClick={handleReject}
                  >
                    رفض الطلب
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    isLoading={isProcessing}
                    onClick={handleApprove}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    قبول وتفعيل الاشتراك فورًا
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
