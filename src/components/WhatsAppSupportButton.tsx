'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle, Headphones, X } from 'lucide-react'

export function WhatsAppSupportButton() {
  const supabase = createClient()
  const [whatsappNumber, setWhatsappNumber] = useState<string>('')
  const [whatsappMessage, setWhatsappMessage] = useState<string>('')
  const [isEnabled, setIsEnabled] = useState<boolean>(true)
  const [isOpenTooltip, setIsOpenTooltip] = useState<boolean>(false)
  const [hasDismissedTooltip, setHasDismissedTooltip] = useState<boolean>(false)

  useEffect(() => {
    const fetchWhatsAppConfig = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'site_info')
          .single()

        if (data?.value) {
          const val = data.value as any
          setWhatsappNumber(val.whatsapp_number || val.contact_phone || '+966500000000')
          setWhatsappMessage(
            val.whatsapp_message ||
              'مرحباً، أود الاستفسار وطلب الدعم الفني بخصوص منصة فكرتو'
          )
          setIsEnabled(val.whatsapp_enabled !== false)
        }
      } catch (err) {
        // Fallback default
        setWhatsappNumber('+966500000000')
        setWhatsappMessage('مرحباً، أود الاستفسار بخصوص منصة فكرتو')
        setIsEnabled(true)
      }
    }

    fetchWhatsAppConfig()
  }, [])

  // Show a welcome tooltip after 3 seconds for discovery (once)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasDismissedTooltip) {
        setIsOpenTooltip(true)
      }
    }, 3500)
    return () => clearTimeout(timer)
  }, [hasDismissedTooltip])

  if (!isEnabled || !whatsappNumber) {
    return null
  }

  // Clean phone number (remove +, spaces, dashes, parentheses)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <aside aria-label="خدمة الدعم الفني عبر واتساب" className="fixed bottom-6 left-6 z-50 flex flex-col items-start select-none">
      {/* Floating Welcome Bubble / Tooltip */}
      {isOpenTooltip && (
        <div className="mb-3 p-3.5 max-w-xs bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
          <button
            onClick={() => {
              setIsOpenTooltip(false)
              setHasDismissedTooltip(true)
            }}
            aria-label="إغلاق التنبيه"
            className="absolute top-2 left-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <Headphones className="w-3.5 h-3.5" />
            <span>الدعم الفني المباشر</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed pe-4">
            تحتاج مساعدة أو لديك استفسار عن الاشتراكات؟ فريق فكرتو جاهز للرد عليك عبر واتساب!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-sm"
          >
            <span>ابدأ المحادثة الآن</span>
          </a>
        </div>
      )}

      {/* Main WhatsApp Floating Pill Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل مع الدعم الفني عبر واتساب"
        onMouseEnter={() => !hasDismissedTooltip && setIsOpenTooltip(true)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Pulsing glow ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />

        {/* WhatsApp SVG Icon */}
        <svg
          className="w-6 h-6 fill-current flex-shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        <span className="font-bold text-xs tracking-wide">
          الدعم الفني
        </span>

        {/* Online Indicator Badge */}
        <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#25D366]" />
      </a>
    </aside>
  )
}
