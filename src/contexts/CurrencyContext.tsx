'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface ArabCountry {
  code: string
  name: string
  shortName: string
  flag: string
  currency: string
  currencySymbol: string
  currencyName: string
  // Pricing: Monthly & Yearly tailored to regional purchasing power
  monthlyPrice: number
  yearlyPrice: number
  // Payment methods popular in this country
  paymentMethods: string[]
  transferInstructions?: string
}

export const ARAB_COUNTRIES: Record<string, ArabCountry> = {
  SA: {
    code: 'SA',
    name: 'المملكة العربية السعودية',
    shortName: 'السعودية',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    currencyName: 'ريال سعودي',
    monthlyPrice: 29,
    yearlyPrice: 199,
    paymentMethods: ['مدى (Mada)', 'STC Pay', 'Urpay', 'تحويل بنكي (الراجحي / الأهلي)', 'Apple Pay', 'بطاقة بنكية'],
    transferInstructions: 'التحويل متاح عبر STC Pay، مدى، أو التحويل المباشر لحساب مصرف الراجحي.',
  },
  EG: {
    code: 'EG',
    name: 'جمهورية مصر العربية',
    shortName: 'مصر',
    flag: '🇪🇬',
    currency: 'EGP',
    currencySymbol: 'ج.م',
    currencyName: 'جنيه مصري',
    monthlyPrice: 290,
    yearlyPrice: 1990,
    paymentMethods: ['إنستاباي (InstaPay)', 'فودافون كاش (Vodafone Cash)', 'محافظ إلكترونية', 'فوري', 'بطاقة ميزة / بنكية'],
    transferInstructions: 'التحويل متاح فورياً عبر إنستاباي (InstaPay) أو محفظة فودافون كاش / أورنج / وي كاش.',
  },
  AE: {
    code: 'AE',
    name: 'الإمارات العربية المتحدة',
    shortName: 'الإمارات',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'د.إ',
    currencyName: 'درهم إماراتي',
    monthlyPrice: 29,
    yearlyPrice: 199,
    paymentMethods: ['Apple Pay', 'بطاقة ائتمانية (Visa / MC)', 'تحويل بنكي محلي (ENBD / ADCB)', 'Careem Pay'],
    transferInstructions: 'التحويل متاح عبر الحسابات البنكية الإماراتية المحلية وبطاقات الدفع.',
  },
  KW: {
    code: 'KW',
    name: 'دولة الكويت',
    shortName: 'الكويت',
    flag: '🇰🇼',
    currency: 'KWD',
    currencySymbol: 'د.ك',
    currencyName: 'دينار كويتي',
    monthlyPrice: 2.5,
    yearlyPrice: 16.5,
    paymentMethods: ['كي نت (KNET)', 'تحويل بنكي (الوطني / بيتك)', 'بطاقة بنكية', 'Apple Pay'],
    transferInstructions: 'الدفع متاح عبر بوابات KNET والتحويل البنكي لحسابات بنك الكويت الوطني أو بيتك.',
  },
  QA: {
    code: 'QA',
    name: 'دولة قطر',
    shortName: 'قطر',
    flag: '🇶🇦',
    currency: 'QAR',
    currencySymbol: 'ر.ق',
    currencyName: 'ريال قطري',
    monthlyPrice: 29,
    yearlyPrice: 199,
    paymentMethods: ['بطاقة بنكية (QNB / مصرف قطر)', 'Apple Pay', 'تحويل بنكي'],
    transferInstructions: 'التحويل متاح عبر الحسابات البنكية القطرية وبطاقات الدفع المباشر.',
  },
  BH: {
    code: 'BH',
    name: 'مملكة البحرين',
    shortName: 'البحرين',
    flag: '🇧🇭',
    currency: 'BHD',
    currencySymbol: 'د.ب',
    currencyName: 'دينار بحريني',
    monthlyPrice: 3,
    yearlyPrice: 20,
    paymentMethods: ['بنفت باي (BenefitPay)', 'بطاقة بنكية', 'Apple Pay'],
    transferInstructions: 'التحويل متوفر فورياً عبر تطبيق بنفت باي (BenefitPay).',
  },
  OM: {
    code: 'OM',
    name: 'سلطنة عُمان',
    shortName: 'عُمان',
    flag: '🇴🇲',
    currency: 'OMR',
    currencySymbol: 'ر.ع',
    currencyName: 'ريال عُماني',
    monthlyPrice: 3,
    yearlyPrice: 20,
    paymentMethods: ['تحويل فوري (Thawani)', 'بنك مسقط', 'بطاقة بنكية'],
    transferInstructions: 'التحويل متاح عبر تطبيقات الدفع العمانية والتحويل لحساب بنك مسقط.',
  },
  JO: {
    code: 'JO',
    name: 'المملكة الأردنية الهاشمية',
    shortName: 'الأردن',
    flag: '🇯🇴',
    currency: 'JOD',
    currencySymbol: 'د.أ',
    currencyName: 'دينار أردني',
    monthlyPrice: 5.5,
    yearlyPrice: 38,
    paymentMethods: ['كليك (CliQ)', 'زين كاش (Zain Cash)', 'أورنج موني', 'بطاقة بنكية'],
    transferInstructions: 'التحويل متاح فورياً عبر كليك (CliQ) ومحفظة زين كاش.',
  },
  IQ: {
    code: 'IQ',
    name: 'جمهورية العراق',
    shortName: 'العراق',
    flag: '🇮🇶',
    currency: 'IQD',
    currencySymbol: 'د.ع',
    currencyName: 'دينار عراقي',
    monthlyPrice: 10000,
    yearlyPrice: 70000,
    paymentMethods: ['زين كاش (Zain Cash)', 'كي كارد (Qi Card)', 'ماستر كارد مصرف الرافدين', 'آسيا حوالة'],
    transferInstructions: 'التحويل متاح عبر زين كاش العراق أو بطاقات كي كارد وآسيا حوالة.',
  },
  MA: {
    code: 'MA',
    name: 'المملكة المغربية',
    shortName: 'المغرب',
    flag: '🇲🇦',
    currency: 'MAD',
    currencySymbol: 'د.م',
    currencyName: 'درهم مغربي',
    monthlyPrice: 79,
    yearlyPrice: 540,
    paymentMethods: ['وفا كاش (Wafacash)', 'كاش بلوس (Cash Plus)', 'بطاقة CMI البنكية', 'تحويل بنكي (التجاري وفا / الشعبي)'],
    transferInstructions: 'التحويل متاح عبر كاش بلوس ووفا كاش أو البطاقات البنكية المغربية.',
  },
  DZ: {
    code: 'DZ',
    name: 'الجمهورية الجزائرية',
    shortName: 'الجزائر',
    flag: '🇩🇿',
    currency: 'DZD',
    currencySymbol: 'د.ج',
    currencyName: 'دينار جزائري',
    monthlyPrice: 1200,
    yearlyPrice: 8500,
    paymentMethods: ['بريدي موب (BaridiMob)', 'البطاقة الذهبية', 'CCP بريد الجزائر'],
    transferInstructions: 'الدفع متاح عبر تطبيق بريدي موب (BaridiMob) أو التحويل إلى حساب CCP.',
  },
  TN: {
    code: 'TN',
    name: 'الجمهورية التونسية',
    shortName: 'تونس',
    flag: '🇹🇳',
    currency: 'TND',
    currencySymbol: 'د.ت',
    currencyName: 'دينار تونسي',
    monthlyPrice: 25,
    yearlyPrice: 170,
    paymentMethods: ['D17 البريد التونسي', 'البطاقة التكنولوجية', 'Sobflous', 'بطاقة بنكية'],
    transferInstructions: 'الدفع متاح عبر تطبيق D17 أو البطاقة التكنولوجية الدولية.',
  },
  LY: {
    code: 'LY',
    name: 'دولة ليبيا',
    shortName: 'ليبيا',
    flag: '🇱🇾',
    currency: 'LYD',
    currencySymbol: 'د.ل',
    currencyName: 'دينار ليبي',
    monthlyPrice: 39,
    yearlyPrice: 270,
    paymentMethods: ['خدمة سداد (Sadad)', 'تداول', 'موبي كاش', 'تحويل مصرفي'],
    transferInstructions: 'التحويل متاح عبر خدمة سداد أو موبي كاش والتحويل المصرفي المباشر.',
  },
  SD: {
    code: 'SD',
    name: 'جمهورية السودان',
    shortName: 'السودان',
    flag: '🇸🇩',
    currency: 'SDG',
    currencySymbol: 'ج.س',
    currencyName: 'جنيه سوداني',
    monthlyPrice: 5000,
    yearlyPrice: 35000,
    paymentMethods: ['تطبيق بنكك (Bankak)', 'فوري بنك فيصل', 'أوكاش'],
    transferInstructions: 'التحويل متاح عبر تطبيق بنكك (بنك الخرطوم) أو فوري بنك فيصل الإسلامي.',
  },
  LB: {
    code: 'LB',
    name: 'الجمهورية اللبنانية',
    shortName: 'لبنان',
    flag: '🇱🇧',
    currency: 'USD',
    currencySymbol: '$',
    currencyName: 'دولار أمريكي',
    monthlyPrice: 7.99,
    yearlyPrice: 54.99,
    paymentMethods: ['Whish Money', 'OMT', 'بطاقة دولية'],
    transferInstructions: 'الدفع متاح بالدولار عبر تطبيق Whish Money أو OMT أو البطاقات الدولية.',
  },
  PS: {
    code: 'PS',
    name: 'دولة فلسطين',
    shortName: 'فلسطين',
    flag: '🇵🇸',
    currency: 'USD',
    currencySymbol: '$',
    currencyName: 'دولار أمريكي',
    monthlyPrice: 7.99,
    yearlyPrice: 54.99,
    paymentMethods: ['جوال باي (Jawwal Pay)', 'بال باي (PalPay)', 'بنك فلسطين (بامكي)', 'بطاقة بنكية'],
    transferInstructions: 'التحويل متاح عبر جوال باي أو بال باي أو التحويل المباشر لبنك فلسطين.',
  },
  YE: {
    code: 'YE',
    name: 'الجمهورية اليمنية',
    shortName: 'اليمن',
    flag: '🇾🇪',
    currency: 'USD',
    currencySymbol: '$',
    currencyName: 'دولار أمريكي',
    monthlyPrice: 7.99,
    yearlyPrice: 54.99,
    paymentMethods: ['محفظة الكريمي (M-Flous)', 'جيب (Jeeb)', 'ون كاش', 'تحويل صرافة'],
    transferInstructions: 'التحويل متاح عبر بنك الكريمي أو محافظ جيب وون كاش وشبكات الصرافة.',
  },
  OTHER: {
    code: 'OTHER',
    name: 'باقي الدول / دولي',
    shortName: 'دولي',
    flag: '🌍',
    currency: 'USD',
    currencySymbol: '$',
    currencyName: 'دولار أمريكي',
    monthlyPrice: 7.99,
    yearlyPrice: 54.99,
    paymentMethods: ['بطاقات الائتمان الدولية (Visa / MasterCard)', 'Apple Pay', 'Google Pay'],
    transferInstructions: 'الدفع متاح بالدولار الأمريكي عبر جميع البطاقات الائتمانية والخصم المباشر.',
  },
}

interface CurrencyContextType {
  currentCountry: ArabCountry
  setCountryCode: (code: string) => void
  formatPrice: (amount: number, overrideSymbol?: string) => string
  convertFromBaseUSD: (usdAmount: number) => number
  countriesList: ArabCountry[]
}

const defaultContext: CurrencyContextType = {
  currentCountry: ARAB_COUNTRIES.SA,
  setCountryCode: () => {},
  formatPrice: (amt) => `${amt} ر.س`,
  convertFromBaseUSD: (usd) => usd * 3.75,
  countriesList: Object.values(ARAB_COUNTRIES),
}

const CurrencyContext = createContext<CurrencyContextType>(defaultContext)

// Mapping from browser timezone to Arab Country code
const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  'Africa/Cairo': 'EG',
  'Asia/Riyadh': 'SA',
  'Asia/Dubai': 'AE',
  'Asia/Kuwait': 'KW',
  'Asia/Qatar': 'QA',
  'Asia/Bahrain': 'BH',
  'Asia/Muscat': 'OM',
  'Asia/Amman': 'JO',
  'Asia/Baghdad': 'IQ',
  'Africa/Casablanca': 'MA',
  'Africa/Algiers': 'DZ',
  'Africa/Tunis': 'TN',
  'Africa/Tripoli': 'LY',
  'Africa/Khartoum': 'SD',
  'Asia/Beirut': 'LB',
  'Asia/Gaza': 'PS',
  'Asia/Hebron': 'PS',
  'Asia/Jerusalem': 'PS',
  'Asia/Aden': 'YE',
  'Asia/Damascus': 'OTHER',
}

const STORAGE_KEY = 'fekrto_user_country'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<string>('SA')
  const [mounted, setMounted] = useState(false)

  // Detect user country on mount
  useEffect(() => {
    try {
      // 1. Check local storage
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && ARAB_COUNTRIES[saved]) {
        setCountryCodeState(saved)
        setMounted(true)
        return
      }

      // 2. Check browser timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (timeZone && TIMEZONE_TO_COUNTRY[timeZone]) {
        const detected = TIMEZONE_TO_COUNTRY[timeZone]
        setCountryCodeState(detected)
        localStorage.setItem(STORAGE_KEY, detected)
        setMounted(true)
        return
      }

      // 3. Check browser language (e.g. ar-EG, ar-SA, etc.)
      const lang = navigator.language || (navigator.languages && navigator.languages[0]) || ''
      const parts = lang.split('-')
      if (parts.length > 1) {
        const region = parts[1].toUpperCase()
        if (ARAB_COUNTRIES[region]) {
          setCountryCodeState(region)
          localStorage.setItem(STORAGE_KEY, region)
          setMounted(true)
          return
        }
      }
    } catch {
      // fallback
    }
    setMounted(true)
  }, [])

  const setCountryCode = (code: string) => {
    if (ARAB_COUNTRIES[code]) {
      setCountryCodeState(code)
      try {
        localStorage.setItem(STORAGE_KEY, code)
      } catch {
        // ignore
      }
    }
  }

  const currentCountry = ARAB_COUNTRIES[countryCode] || ARAB_COUNTRIES.SA

  const formatPrice = (amount: number, overrideSymbol?: string) => {
    const symbol = overrideSymbol || currentCountry.currencySymbol
    // Format number nicely with comma separators if needed
    const formattedNum = new Intl.NumberFormat('ar-EG', {
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
    return `${formattedNum} ${symbol}`
  }

  const convertFromBaseUSD = (usdAmount: number) => {
    const ratio = currentCountry.monthlyPrice / 7.99
    return Math.round(usdAmount * ratio)
  }

  return (
    <CurrencyContext.Provider
      value={{
        currentCountry,
        setCountryCode,
        formatPrice,
        convertFromBaseUSD,
        countriesList: Object.values(ARAB_COUNTRIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
