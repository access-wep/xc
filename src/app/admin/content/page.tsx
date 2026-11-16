'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, Input, Textarea, Badge } from '@/components/ui'
import {
  Sparkles,
  Save,
  Check,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  HelpCircle,
  MessageSquare,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
} from 'lucide-react'

export interface LandingCMSData {
  hero: {
    badge: string
    title: string
    highlight: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
    socialProof: string
  }
  sections: {
    hero: boolean
    quickPills: boolean
    problemSolution: boolean
    liveDemo: boolean
    features: boolean
    habits: boolean
    realStats: boolean
    testimonials: boolean
    pricing: boolean
    mobileApp: boolean
    faq: boolean
    finalCta: boolean
  }
  statsConfig: {
    showRealUsers: boolean
    showRealTasks: boolean
    showRealHabits: boolean
    showRealTemplates: boolean
    editorialUptime: string
    editorialSatisfaction: string
  }
  faqs: Array<{ q: string; a: string }>
  testimonials: Array<{
    name: string
    role: string
    comment: string
    rating: number
    avatar?: string
  }>
}

const defaultCMSData: LandingCMSData = {
  hero: {
    badge: 'أكثر من مجرد مهام ...',
    title: 'فكرتو طريقك للإنجاز',
    highlight: 'نظم وقتك، خطط ليومك، تابع عاداتك، وحقق أهدافك، كل ذلك في مكان واحد.',
    description: 'منصة ذكية تجمع بين التصميم، الإنتاجية، والتحفيز في تجربة استثنائية.',
    ctaPrimary: 'ابدأ الآن مجاناً',
    ctaSecondary: 'شاهد العرض',
    socialProof: 'أكثر من 10k مستخدم يحققون أهدافهم مع فكرتو',
  },
  sections: {
    hero: true,
    quickPills: true,
    problemSolution: true,
    liveDemo: true,
    features: true,
    habits: true,
    realStats: true,
    testimonials: true,
    pricing: true,
    mobileApp: true,
    faq: true,
    finalCta: true,
  },
  statsConfig: {
    showRealUsers: true,
    showRealTasks: true,
    showRealHabits: true,
    showRealTemplates: true,
    editorialUptime: '99.9%',
    editorialSatisfaction: '98%',
  },
  faqs: [
    {
      q: 'ما هي منصة فكرتو وكيف تساعدني في تنظيم يومي؟',
      a: 'فكرتو هي منصة إنتاجية فضائية متكاملة مصممة خصيصاً لإيقاع اليوم العربي، تجمع بين الجداول الذكية، تتبع العادات، وتحليلات الإنجاز التفاعلية في واجهة ثلاثية الأبعاد سلسة.',
    },
    {
      q: 'هل يمكنني استخدام فكرتو مجاناً؟',
      a: 'نعم! توفر فكرتو باقة مجانية مدى الحياة تتيح لك إدارة مهامك اليومية وجدولك الأساسي بكل سهولة.',
    },
    {
      q: 'كيف يعمل نظام متابعة العادات والـ Streaks؟',
      a: 'يتيح لك النظام تسجيل عاداتك اليومية مع احتساب أيام الالتزام المتتالية لتحفيزك والحفاظ على استمرارية إنتاجيتك.',
    },
    {
      q: 'ما هي طرق الدفع المتاحة للاشتراك؟',
      a: 'ندعم الدفع الآمن عبر مدى (mada)، البطاقات الائتمانية (VISA / Mastercard)، و Apple Pay، بالإضافة للتحويل البنكي المباشر مع مراجعة فورية.',
    },
  ],
  testimonials: [
    {
      name: 'أحمد خالد',
      role: 'رائد أعمال ومبرمج',
      comment: 'فكرتو غيرت طريقة تنظيمي لوقتي بالكامل. النواة التفاعلية والجداول الدقيقة جعلت يومي أكثر تركيزاً وإنجازاً.',
      rating: 5,
    },
    {
      name: 'سارة محمود',
      role: 'مصممة واجهات ومستقلة',
      comment: 'التقارير والتحليلات ساعدتني أفهم إنتاجيتي وأتخلص من التشتت. التصميم الزجاجي والمؤثرات تمنح متعة حقيقية أثناء العمل.',
      rating: 5,
    },
    {
      name: 'محمد علي',
      role: 'طالب دراسات عليا',
      comment: 'من أفضل المنصات التي استخدمتها في حياتي. قوالب الجداول وتتبع العادات ساعداني في إنجاز أطروحتي دون ضغوط.',
      rating: 5,
    },
    {
      name: 'لينا أحمد',
      role: 'مديرة تسويق رقمي',
      comment: 'تنظيم المهام والالتزام اليومي ساعد فريقي في تحقيق نتائج استثنائية. منصة عربية بمواصفات عالمية راقية.',
      rating: 5,
    },
  ],
}

export default function AdminContentPage() {
  const supabase = createClient()
  const [cms, setCms] = useState<LandingCMSData>(defaultCMSData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'stats' | 'faqs' | 'testimonials'>('hero')

  // Load existing CMS settings
  useEffect(() => {
    const loadCMS = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'landing_page_content')
          .maybeSingle()

        if (data?.value) {
          setCms({ ...defaultCMSData, ...(data.value as any) })
        }
      } catch (err) {
        console.error('Failed to load landing CMS:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCMS()
  }, [])

  // Save CMS settings
  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'landing_page_content')
        .maybeSingle()

      if (existing) {
        await supabase
          .from('site_settings')
          .update({
            value: cms as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      } else {
        await supabase.from('site_settings').insert({
          key: 'landing_page_content',
          value: cms as any,
          description: 'Landing Page CMS Content & Section Configuration',
          updated_at: new Date().toISOString(),
        })
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save landing CMS:', err)
      alert('حدث خطأ أثناء حفظ المحتوى')
    } finally {
      setIsSaving(false)
    }
  }

  // FAQ Handlers
  const addFAQ = () => {
    setCms((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { q: 'سؤال جديد...', a: 'إجابة السؤال...' }],
    }))
  }

  const removeFAQ = (idx: number) => {
    setCms((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx),
    }))
  }

  const updateFAQ = (idx: number, field: 'q' | 'a', value: string) => {
    setCms((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f, i) => (i === idx ? { ...f, [field]: value } : f)),
    }))
  }

  // Testimonial Handlers
  const addTestimonial = () => {
    setCms((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        {
          name: 'مستخدم جديد',
          role: 'مسمى وظيفي',
          comment: 'تجربة مميزة مع فكرتو...',
          rating: 5,
        },
      ],
    }))
  }

  const removeTestimonial = (idx: number) => {
    setCms((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== idx),
    }))
  }

  const updateTestimonial = (idx: number, field: string, value: any) => {
    setCms((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) =>
        i === idx ? { ...t, [field]: value } : t
      ),
    }))
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400 font-cairo">
        جاري تحميل نظام إدارة محتوى الصفحة الرئيسية...
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 font-cairo" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">إدارة محتوى الصفحة الرئيسية (CMS)</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              تحكم كامل في نصوص، أقسام، إحصائيات، وآراء الصفحة الرئيسية بدون تعديل الكود
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2"
        >
          {isSaving ? (
            <span>جاري الحفظ...</span>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>تم الحفظ بنجاح!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </>
          )}
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
        {[
          { id: 'hero', label: 'القسم الرئيسي (Hero)', icon: Sparkles },
          { id: 'sections', label: 'التحكم بالأقسام (إظهار/إخفاء)', icon: Layers },
          { id: 'stats', label: 'الإحصائيات الحقيقية والتحريرية', icon: BarChart3 },
          { id: 'testimonials', label: 'آراء المستخدمين', icon: MessageSquare },
          { id: 'faqs', label: 'الأسئلة الشائعة (FAQ)', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: HERO */}
      {activeTab === 'hero' && (
        <Card className="p-6 bg-slate-900/60 border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">تخصيص نصوص القسم الرئيسي (Hero Section)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">الشارة العلوية (Badge)</label>
              <Input
                value={cms.hero.badge}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, badge: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">العنوان الرئيسي</label>
              <Input
                value={cms.hero.title}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, title: e.target.value } })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">السطر المميز التوجيهي</label>
            <Input
              value={cms.hero.highlight}
              onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, highlight: e.target.value } })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">الوصف التفصيلي</label>
            <Textarea
              rows={3}
              value={cms.hero.description}
              onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, description: e.target.value } })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">نص الزر الأساسي</label>
              <Input
                value={cms.hero.ctaPrimary}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, ctaPrimary: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">نص الزر الثانوي</label>
              <Input
                value={cms.hero.ctaSecondary}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, ctaSecondary: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">نص الإثبات الاجتماعي (Social Proof)</label>
              <Input
                value={cms.hero.socialProof}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, socialProof: e.target.value } })}
              />
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: SECTIONS VISIBILITY */}
      {activeTab === 'sections' && (
        <Card className="p-6 bg-slate-900/60 border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">التحكم في إظهار وإخفاء أقسام الصفحة الرئيسية</h3>
          <p className="text-xs text-gray-400 mb-4">
            يمكنك تعطيل أو تفعيل أي قسم بحرية وسيختفي أو يظهر مباشرة على الواجهة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {[
              { key: 'hero', label: 'القسم الرئيسي (Hero + 3D Cube)' },
              { key: 'quickPills', label: 'شريط المميزات السريع' },
              { key: 'problemSolution', label: 'قسم المشكلة والحل (قبل وبعد فكرتو)' },
              { key: 'liveDemo', label: 'العرض التفاعلي الحي لجدول اليوم' },
              { key: 'features', label: 'البطاقات الأربع للمميزات' },
              { key: 'habits', label: 'قسم بناء العادات اليومية' },
              { key: 'realStats', label: 'إحصائيات المنصة الحقيقية' },
              { key: 'testimonials', label: 'آراء وتقييمات المستخدمين' },
              { key: 'pricing', label: 'باقات الاشتراك والأسعار' },
              { key: 'mobileApp', label: 'قسم فكرتو على هاتفك' },
              { key: 'faq', label: 'الأسئلة الشائعة (FAQ)' },
              { key: 'finalCta', label: 'دعوة التسجيل النهائية (Call to Action)' },
            ].map((sec) => {
              const isEnabled = (cms.sections as any)[sec.key]
              return (
                <div
                  key={sec.key}
                  onClick={() =>
                    setCms({
                      ...cms,
                      sections: {
                        ...cms.sections,
                        [sec.key]: !isEnabled,
                      },
                    })
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                    isEnabled
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/40 border-white/10 text-gray-400 opacity-60'
                  }`}
                >
                  <span className="text-xs font-bold font-cairo">{sec.label}</span>
                  <div
                    className={`p-1.5 rounded-lg border ${
                      isEnabled ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    {isEnabled ? <Eye className="w-3.5 h-3.5 stroke-[2.5]" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* TAB 3: STATS CONFIG */}
      {activeTab === 'stats' && (
        <Card className="p-6 bg-slate-900/60 border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">التحكم في مصادر وعرض الإحصائيات</h3>
            <p className="text-xs text-gray-400">
              الإحصائيات التلقائية تُجلب فعلياً ومباشرة من قاعدة بيانات Supabase لضمان المصداقية.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              1. الإحصائيات التلقائية (من قاعدة البيانات)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'showRealUsers', label: 'إجمالي المستخدمين المسجلين فعلياً' },
                { key: 'showRealTasks', label: 'إجمالي المهام المنجزة فعلياً' },
                { key: 'showRealHabits', label: 'إجمالي العادات المتتبعة في المنصة' },
                { key: 'showRealTemplates', label: 'إجمالي القوالب الجاهزة المتاحة' },
              ].map((st) => {
                const val = (cms.statsConfig as any)[st.key]
                return (
                  <div
                    key={st.key}
                    onClick={() =>
                      setCms({
                        ...cms,
                        statsConfig: {
                          ...cms.statsConfig,
                          [st.key]: !val,
                        },
                      })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                      val
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/40 border-white/10 text-gray-400 opacity-60'
                    }`}
                  >
                    <span className="text-xs font-bold">{st.label}</span>
                    <Badge variant={val ? 'success' : 'default'} size="sm">
                      {val ? 'مفعل (بيانات حية)' : 'معطل'}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              2. الإحصائيات التحريرية (معلومات تشغيلية عامة)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">معدل استقرار وتوافر النظام (Uptime)</label>
                <Input
                  value={cms.statsConfig.editorialUptime}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      statsConfig: { ...cms.statsConfig, editorialUptime: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">معدل رضا المشتركين</label>
                <Input
                  value={cms.statsConfig.editorialSatisfaction}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      statsConfig: { ...cms.statsConfig, editorialSatisfaction: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <Card className="p-6 bg-slate-900/60 border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">إدارة آراء وتجارب المستخدمين</h3>
            <Button
              onClick={addTestimonial}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>إضافة رأي مستخدم</span>
            </Button>
          </div>

          <div className="space-y-3.5">
            {cms.testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 relative"
              >
                <button
                  onClick={() => removeTestimonial(idx)}
                  className="absolute top-4 left-4 p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                  title="حذف الرأي"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">اسم المستخدم</label>
                    <Input
                      value={t.name}
                      onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">المسمى الوظيفي / الوصف</label>
                    <Input
                      value={t.role}
                      onChange={(e) => updateTestimonial(idx, 'role', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">نص التجربة أو التقييم</label>
                  <Textarea
                    rows={2}
                    value={t.comment}
                    onChange={(e) => updateTestimonial(idx, 'comment', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: FAQS */}
      {activeTab === 'faqs' && (
        <Card className="p-6 bg-slate-900/60 border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">إدارة الأسئلة الشائعة (FAQ)</h3>
            <Button
              onClick={addFAQ}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>إضافة سؤال جديد</span>
            </Button>
          </div>

          <div className="space-y-3.5">
            {cms.faqs.map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2.5 relative"
              >
                <button
                  onClick={() => removeFAQ(idx)}
                  className="absolute top-4 left-4 p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                  title="حذف السؤال"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="max-w-xl">
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">السؤال</label>
                  <Input
                    value={f.q}
                    onChange={(e) => updateFAQ(idx, 'q', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">الإجابة</label>
                  <Textarea
                    rows={2}
                    value={f.a}
                    onChange={(e) => updateFAQ(idx, 'a', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
