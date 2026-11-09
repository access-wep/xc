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
} from 'lucide-react'
import type { PaymentRequest } from '@/types/database'

export default function AdminPaymentsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [requests, setRequests] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Review & Action Modal
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Load All Payment Requests with User Profile details
  const loadPaymentRequests = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('payment_requests')
        .select(`
          *,
          profiles:user_id(full_name, email, phone),
          payment_methods:payment_method_id(name_ar)
        `)
        .order('created_at', { ascending: false })

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query
      if (error) throw error
      setRequests(data || [])
    } catch (err) {
      console.error('Error fetching payments:', err)
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

        {/* Filter Pills */}
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
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {req.amount} ر.س
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {req.is_yearly ? 'اشتراك سنوي' : 'اشتراك شهري'}
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

            {/* Proof Image Box */}
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                صورة إيصال التحويل البنكي المرفق:
              </label>
              {selectedRequest.proof_url ? (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-72 flex items-center justify-center bg-gray-900/10">
                  <img
                    src={selectedRequest.proof_url}
                    alt="إيصال التحويل"
                    className="max-h-72 object-contain"
                    onError={(e) => {
                      (e.target as any).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="20" y="50" fill="gray">إيصال تجريبي محلي</text></svg>'
                    }}
                  />
                </div>
              ) : (
                <p className="text-xs text-amber-500">لم يتم إرفاق رابط صورة للإيصال.</p>
              )}
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
