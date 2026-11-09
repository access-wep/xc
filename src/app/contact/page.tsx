'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Button, Input, Textarea } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import { Sparkles, Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, Sun, Moon } from 'lucide-react'

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-950 flex flex-col justify-between">
      {/* Navigation */}
      <nav className="h-16 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">فكرتو</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            href="/"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>الصفحة الرئيسية</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Main Form & Info */}
      <main className="max-w-5xl w-full mx-auto p-6 sm:p-10 my-8 flex-1">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            تواصل مع فريق فكرتو
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            نحن هنا للإجابة على جميع استفساراتك وتقديم الدعم الفني لك على مدار الساعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="md:col-span-5 space-y-4">
            <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20">
              <h3 className="text-lg font-bold mb-4">معلومات الاتصال</h3>
              <div className="space-y-4 text-xs sm:text-sm text-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-indigo-200">البريد الإلكتروني</span>
                    <span className="font-semibold text-white">support@fekrto.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-indigo-200">خدمة العملاء واتساب</span>
                    <span className="font-semibold text-white">+966 50 000 0000</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-indigo-200">المقر</span>
                    <span className="font-semibold text-white">المملكة العربية السعودية / الرياض</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <Card className="p-8 shadow-sm">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                    شكراً لتواصلك معنا. سنقوم بالرد عليك عبر بريدك الإلكتروني في أقرب وقت.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSuccess(false)}>
                    إرسال رسالة أخرى
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="الاسم الكامل *"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="اسمك"
                    />
                    <Input
                      label="البريد الإلكتروني *"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                    />
                  </div>

                  <Input
                    label="موضوع الرسالة *"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="استفسار، اقتراح، مساعدة في الاشتراك..."
                  />

                  <Textarea
                    label="نص الرسالة *"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك بالتفصيل هنا..."
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={isSubmitting}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الرسالة</span>
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} فكرتو (Fekrto). جميع الحقوق محفوظة.
      </footer>
    </div>
  )
}
