'use client'

import React from 'react'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { Sparkles, Lock, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface PaywallLockedCardProps {
  title: string
  description: string
  features?: string[]
}

export function PaywallLockedCard({
  title,
  description,
  features = [
    'جداول ومهام غير محدودة',
    'متابعة العادات الشهرية وسلسلة الالتزام',
    'تحليلات بيانية مفصلة وأوقات التركيز الذكية',
    'كافة القوالب الجاهزة المخصصة للعمل والدراسة',
    'أولوية الدعم الفني المباشر عبر واتساب',
  ],
}: PaywallLockedCardProps) {
  return (
    <Card className="p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 via-white dark:via-gray-900 to-transparent shadow-xl rounded-3xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lock Badge */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/25">
        <Lock className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>ميزة حصرية لمشتركي فكرتو برو</span>
      </div>

      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
        {title}
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
        {description}
      </p>

      {/* Included Features Bullet Points */}
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-start max-w-md mx-auto mb-8 space-y-2.5">
        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
          ما ستحصل عليه فور الترقية:
        </p>
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/dashboard/subscription" className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>ترقية حسابي والاشتراك الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            العودة إلى لوحة التحكم
          </Button>
        </Link>
      </div>
    </Card>
  )
}
