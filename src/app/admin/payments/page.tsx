'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Badge, Modal, Textarea, Input, Select } from '@/components/ui'
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
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  Printer,
  Search,
  Check,
  ShieldCheck,
  Calendar,
  CreditCard,
  User,
  ArrowUpRight,
} from 'lucide-react'
import type { PaymentRequest } from '@/types/database'

export default function AdminPaymentsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [requests, setRequests] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlanType, setFilterPlanType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
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

  // Manual Payment Creation Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [manualUserEmail, setManualUserEmail] = useState('')
  const [manualPlanType, setManualPlanType] = useState<'monthly' | 'yearly'>('monthly')
  const [manualAmount, setManualAmount] = useState<number>(29)
  const [manualMethodName, setManualMethodName] = useState('تحويل بنكي مباشر')
  const [manualNote, setManualNote] = useState('')
  const [isCreatingManualPayment, setIsCreatingManualPayment] = useState(false)
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null)

  // Invoice Print Modal State
  const [invoiceToPrint, setInvoiceToPrint] = useState<any | null>(null)

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

  // Computed Financial Metrics
  const metrics = useMemo(() => {
    const totalCount = requests.length
    const approved = requests.filter((r) => r.status === 'approved')
    const pending = requests.filter((r) => r.status === 'pending')
    const rejected = requests.filter((r) => r.status === 'rejected')

    const totalRevenue = approved.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
    const avgOrderValue = approved.length > 0 ? Math.round(totalRevenue / approved.length) : 0
    const approvalRate = totalCount > 0 ? Math.round((approved.length / totalCount) * 100) : 0

    return {
      totalCount,
      totalRevenue,
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      avgOrderValue,
      approvalRate,
    }
  }, [requests])

  // Filtered requests based on search term and plan cycle
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Plan cycle filter
      if (filterPlanType === 'yearly' && !req.is_yearly) return false
      if (filterPlanType === 'monthly' && req.is_yearly) return false

      // Search term
      if (!searchTerm.trim()) return true
      const term = searchTerm.toLowerCase().trim()
      const name = (req.profiles?.full_name || '').toLowerCase()
      const email = (req.profiles?.email || '').toLowerCase()
      const phone = (req.profiles?.phone || '').toLowerCase()
      const id = (req.id || '').toLowerCase()
      const amount = String(req.amount || '')

      return (
        name.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        id.includes(term) ||
        amount.includes(term)
      )
    })
  }, [requests, filterPlanType, searchTerm])

  // Approve Payment -> Automatically activates subscription!
  const handleApprove = async () => {
    if (!selectedRequest || !user) return
    setIsProcessing(true)

    try {
      const startDate = new Date()
      const endDate = new Date(startDate)
      if (selectedRequest.is_yearly) {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      // 1. Create or activate the subscription
      const { data: newSub, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: selectedRequest.user_id,
          plan_id: selectedRequest.plan_id || '00000000-0000-0000-0000-000000000000',
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

      // 2. Update payment_request status
      const { error: reqError } = await supabase
        .from('payment_requests')
        .update({
          status: 'approved',
          subscription_id: newSub?.id || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_note: adminNote || 'تم التحقق من التحويل وتفعيل الاشتراك بنجاح.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedRequest.id)

      if (reqError) throw reqError

      // 3. User notification
      try {
        await supabase.from('notifications').insert({
          user_id: selectedRequest.user_id,
          title: 'تم تفعيل اشتراكك بنجاح! 🎉',
          message: `تم اعتماد إيصال الدفع وتفعيل باقتك حتى ${endDate.toLocaleDateString('ar-SA')}.`,
          type: 'subscription_approved',
          action_url: '/dashboard/subscription',
        })
      } catch {}

      // 4. Log admin activity
      try {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'approve_payment',
          entity_type: 'payment_request',
          entity_id: selectedRequest.id,
          details: { amount: selectedRequest.amount, is_yearly: selectedRequest.is_yearly },
        })
      } catch {}

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

      try {
        await supabase.from('notifications').insert({
          user_id: selectedRequest.user_id,
          title: 'تعذر قبول إيصال الدفع',
          message: `سبب الرفض: ${rejectionReason}. يمكنك إعادة المحاولة برفع إيصال صحيح.`,
          type: 'subscription_rejected',
          action_url: '/dashboard/subscription',
        })
      } catch {}

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

  // Manual Direct Payment Recording by Admin
  const handleCreateManualPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualUserEmail.trim() || !user) return
    setIsCreatingManualPayment(true)
    setManualSuccessMsg(null)

    try {
      // 1. Find user profile by email
      const { data: targetProfile, error: pErr } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('email', manualUserEmail.trim())
        .maybeSingle()

      if (pErr || !targetProfile) {
        alert('لم يتم العثور على مستخدم مسجل بهذا البريد الإلكتروني. تأكد من صحة البريد.')
        setIsCreatingManualPayment(false)
        return
      }

      // 2. Fetch default active plan
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()

      const startDate = new Date()
      const endDate = new Date(startDate)
      if (manualPlanType === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      // 3. Insert active subscription
      const { data: newSub, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: targetProfile.id,
          plan_id: planData?.id || '00000000-0000-0000-0000-000000000000',
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_yearly: manualPlanType === 'yearly',
          amount_paid: Number(manualAmount) || 0,
        })
        .select()
        .single()

      if (subError) throw subError

      // 4. Fetch or use a payment method ID
      const { data: methodData } = await supabase
        .from('payment_methods')
        .select('id')
        .limit(1)
        .maybeSingle()

      // 5. Insert approved payment request
      await supabase.from('payment_requests').insert({
        user_id: targetProfile.id,
        plan_id: planData?.id || '00000000-0000-0000-0000-000000000000',
        subscription_id: newSub.id,
        is_yearly: manualPlanType === 'yearly',
        payment_method_id: methodData?.id || '00000000-0000-0000-0000-000000000000',
        amount: Number(manualAmount) || 0,
        currency: 'SAR',
        status: 'approved',
        admin_note: manualNote || `تم تسجيل الدفعة يدوياً بواسطة الإدارة (${manualMethodName})`,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })

      // 6. User notification
      try {
        await supabase.from('notifications').insert({
          user_id: targetProfile.id,
          title: 'تم تسجيل اشتراكك وتفعيله بنجاح! 🎁',
          message: `تم اعتماد باقتك (${manualPlanType === 'yearly' ? 'السنوية' : 'الشهرية'}) بنجاح حتى ${endDate.toLocaleDateString('ar-SA')}.`,
          type: 'subscription_approved',
          action_url: '/dashboard/subscription',
        })
      } catch {}

      setManualSuccessMsg(`تم بنجاح تسجيل الدفعة وتفعيل اشتراك ${targetProfile.full_name || targetProfile.email} حتى ${endDate.toLocaleDateString('ar-SA')}!`)
      loadPaymentRequests()
      setTimeout(() => {
        setIsManualModalOpen(false)
        setManualSuccessMsg(null)
        setManualUserEmail('')
      }, 3000)
    } catch (err: any) {
      console.error('Manual payment creation error:', err)
      alert(err.message || 'حدث خطأ أثناء تسجيل الدفعة اليدوية.')
    } finally {
      setIsCreatingManualPayment(false)
    }
  }

  // Export Financial CSV Report
  const handleExportCSV = () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      alert('لا توجد بيانات متاحة للتصدير.')
      return
    }

    const headers = ['المعرف', 'اسم العميل', 'البريد الإلكتروني', 'الهاتف', 'نوع الباقة', 'المبلغ', 'العملة', 'طريقة الدفع', 'الحالة', 'تاريخ الإنشاء', 'ملاحظات الإدارة']
    const rows = filteredRequests.map((r) => [
      `"${r.id}"`,
      `"${r.profiles?.full_name || ''}"`,
      `"${r.profiles?.email || ''}"`,
      `"${r.profiles?.phone || ''}"`,
      `"${r.is_yearly ? 'سنوي' : 'شهري'}"`,
      r.amount || 0,
      `"${r.currency || 'ر.س'}"`,
      `"${r.payment_methods?.name_ar || 'تحويل'}"`,
      `"${r.status === 'approved' ? 'معتمد' : r.status === 'rejected' ? 'مرفوض' : 'معلق'}"`,
      `"${new Date(r.created_at).toISOString()}"`,
      `"${r.admin_note || r.rejection_reason || ''}"`,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `fekrto_payments_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-500" />
            <span>مركز إدارة المدفوعات والاشتراكات المتقدم</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            متابعة دقيقة لكافة التحويلات، اعتماد الحوالات، تسجيل الدفعات المباشرة، وتصدير التقارير المالية
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsManualModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل دفعة يدوية مباشرة</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5"
            title="تصدير كشف حساب CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadPaymentRequests}
            isLoading={isLoading}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 1. Four Financial KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-bold">إجمالي الإيرادات المعتمدة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {metrics.totalRevenue.toLocaleString('ar-SA')} <span className="text-xs font-normal text-gray-500">ر.س</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            من {metrics.approvedCount} عملية اشتراك ناجحة
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-bold">طلبات بانتظار المراجعة</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {metrics.pendingCount} <span className="text-xs font-normal text-gray-500">طلبات</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            تتطلب فحص الإيصال والاعتماد
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-bold">متوسط قيمة العملية</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {metrics.avgOrderValue} <span className="text-xs font-normal text-gray-500">ر.س</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            معدل قيمة الاشتراكات الفعالة
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-bold">معدل قبول المدفوعات</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {metrics.approvalRate}%
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            إجمالي السجلات: {metrics.totalCount}
          </p>
        </Card>
      </div>

      {/* 2. Filter & Search Controls Strip */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث بالاسم، البريد، الهاتف، أو المبلغ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status & Plan Type Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'pending', label: 'المعلقة' },
                { id: 'approved', label: 'المعتمدة' },
                { id: 'rejected', label: 'المرفوضة' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFilterStatus(s.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterStatus === s.id
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Plan Cycle Filter */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
              {[
                { id: 'all', label: 'كافة الباقات' },
                { id: 'monthly', label: 'شهري' },
                { id: 'yearly', label: 'سنوي' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFilterPlanType(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterPlanType === p.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Requests Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500 text-xs">
            جاري تحميل طلبات الدفع...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xs">
            لا توجد طلبات دفع متطابقة مع معايير البحث والتصفية.
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
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {req.profiles?.full_name || 'غير معروف'}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {req.profiles?.email}
                      </p>
                      {req.profiles?.phone && (
                        <p className="text-[10px] text-gray-400 font-mono">
                          {req.profiles.phone}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {req.amount} {req.currency || 'ر.س'}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-medium">
                        {req.subscription_plans?.name_ar || (req.is_yearly ? 'اشتراك سنوي (365 يوم)' : 'اشتراك شهري (30 يوم)')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                      {req.payment_methods?.name_ar || 'تحويل بنكي / يدوي'}
                    </td>

                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(req.created_at).toLocaleDateString('ar-SA')}
                      <span className="block text-[10px] text-gray-400">
                        {new Date(req.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
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
                      <div className="flex items-center justify-center gap-1.5">
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

                        {req.status === 'approved' && (
                          <button
                            onClick={() => setInvoiceToPrint(req)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="طباعة إشعار الدفع / الفاتورة"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* 4. Review & Approval Modal */}
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
              {selectedRequest.profiles?.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم الهاتف:</span>
                  <span className="font-mono">{selectedRequest.profiles?.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ المطلوب اعتماده:</span>
                <span className="font-black text-emerald-600 text-sm">
                  {selectedRequest.amount} {selectedRequest.currency || 'ر.س'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">نوع الباقة:</span>
                <span className="font-semibold">{selectedRequest.is_yearly ? 'سنوي (365 يوم)' : 'شهري (30 يوم)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">تاريخ الطلب:</span>
                <span>{new Date(selectedRequest.created_at).toLocaleString('ar-SA')}</span>
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

            {/* Quick Rejection Reason Chips */}
            {selectedRequest.status === 'pending' && (
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  أسباب الرفض الشائعة (اضغط لاختيار سبب سريع):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'صورة الإيصال غير واضحة',
                    'رقم الحوالة غير مطابق للعملية',
                    'المبلغ المحول ناقص عن قيمة الباقة',
                    'اسم المحول غير مطابق لبيانات الحساب',
                  ].map((reason, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectionReason(reason)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[11px] text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>

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
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedRequest(null)}
              >
                إغلاق
              </Button>

              <div className="flex items-center gap-2">
                {selectedRequest.status === 'approved' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setInvoiceToPrint(selectedRequest)
                      setSelectedRequest(null)
                    }}
                    className="gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الفاتورة</span>
                  </Button>
                )}

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
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      قبول وتفعيل الاشتراك فوراً
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 5. Manual Payment Recording Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="تسجيل دفعة يدوية وتفعيل اشتراك فوري"
        size="md"
      >
        <form onSubmit={handleCreateManualPayment} className="space-y-4">
          <p className="text-xs text-gray-500">
            تتيح لك هذه الأداة تسجيل عملية دفع مباشرة لعميل قام بالتحويل خارج الموقع وتفعيل باقته فورياً دون الحاجة لرفعه إيصالاً بنفسه.
          </p>

          {manualSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{manualSuccessMsg}</span>
            </div>
          )}

          <Input
            label="البريد الإلكتروني للعميل المسجل *"
            type="email"
            required
            value={manualUserEmail}
            onChange={(e) => setManualUserEmail(e.target.value)}
            placeholder="client@example.com"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="دورة الاشتراك"
              value={manualPlanType}
              onChange={(e) => {
                const val = e.target.value as 'monthly' | 'yearly'
                setManualPlanType(val)
                setManualAmount(val === 'yearly' ? 199 : 29)
              }}
              options={[
                { value: 'monthly', label: 'شهري (30 يوم)' },
                { value: 'yearly', label: 'سنوي (365 يوم)' },
              ]}
            />

            <Input
              label="المبلغ المحصل (ر.س) *"
              type="number"
              min="0"
              required
              value={manualAmount}
              onChange={(e) => setManualAmount(Number(e.target.value))}
            />
          </div>

          <Input
            label="طريقة الاستلام / التحويل"
            value={manualMethodName}
            onChange={(e) => setManualMethodName(e.target.value)}
            placeholder="مثال: تحويل الراجحي، كاش، إنستاباي..."
          />

          <Input
            label="ملاحظات إدارية (اختياري)"
            value={manualNote}
            onChange={(e) => setManualNote(e.target.value)}
            placeholder="مثال: تم الاستلام نقداً في المقر..."
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsManualModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreatingManualPayment}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              تأكيد الدفعة وتفعيل الاشتراك
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Printable Official Receipt / Invoice Modal */}
      <Modal
        isOpen={!!invoiceToPrint}
        onClose={() => setInvoiceToPrint(null)}
        title="إشعار استلام رسمي وفاتورة دفع"
        size="md"
      >
        {invoiceToPrint && (
          <div className="space-y-4">
            <div id="printable-receipt" className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-base font-black text-emerald-600">فكرتو • Fekrto</h3>
                  <p className="text-[10px] text-gray-400">منصة تنظيم الوقت والإنتاجية العربية</p>
                </div>
                <div className="text-end">
                  <Badge variant="success">إشعار دفع معتمد</Badge>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">#{invoiceToPrint.id.substring(0, 8)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-gray-400 block text-[10px]">المشترك:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{invoiceToPrint.profiles?.full_name}</span>
                  <span className="block text-gray-500 font-mono text-[10px]">{invoiceToPrint.profiles?.email}</span>
                </div>
                <div className="text-end">
                  <span className="text-gray-400 block text-[10px]">تاريخ الاعتماد:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(invoiceToPrint.reviewed_at || invoiceToPrint.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span>الخدمة:</span>
                  <span className="font-bold">اشتراك فكرتو برو ({invoiceToPrint.is_yearly ? 'سنوي' : 'شهري'})</span>
                </div>
                <div className="flex justify-between">
                  <span>طريقة التحويل:</span>
                  <span>{invoiceToPrint.payment_methods?.name_ar || 'تحويل بنكي'}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700 text-emerald-600 font-black text-sm">
                  <span>المبلغ المدفوع:</span>
                  <span>{invoiceToPrint.amount} {invoiceToPrint.currency || 'ر.س'}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-gray-400 border-t border-gray-100 dark:border-gray-800">
                نشكركم لاختياركم منصة فكرتو • نسعد بدعم إنتاجيتكم
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setInvoiceToPrint(null)}>
                إغلاق
              </Button>
              <Button
                variant="primary"
                onClick={() => window.print()}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الإشعار</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
