'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useCurrency, ARAB_COUNTRIES, type ArabCountry } from '@/contexts/CurrencyContext'
import { ChevronDown, Globe, Check, Search, X } from 'lucide-react'

interface CurrencySelectorProps {
  compact?: boolean
  className?: string
}

export function CurrencySelector({ compact = false, className = '' }: CurrencySelectorProps) {
  const { currentCountry, setCountryCode, countriesList } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredCountries = countriesList.filter(
    (c) =>
      c.name.includes(search) ||
      c.shortName.includes(search) ||
      c.currency.toLowerCase().includes(search.toLowerCase()) ||
      c.currencySymbol.includes(search) ||
      c.currencyName.includes(search)
  )

  const handleSelect = (code: string) => {
    setCountryCode(code)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
        title="تغيير الدولة والعملة"
      >
        <span className="text-base leading-none">{currentCountry.flag}</span>
        <span className="font-semibold">{currentCountry.shortName}</span>
        <span className="text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">
          ({currentCountry.currencySymbol})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-[100] w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-950/20 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>اختر دولتك في الوطن العربي</span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                الأسعار تتعدل تلقائياً
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن دولتك أو العملة..."
                className="w-full pl-3 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* List of Countries */}
          <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-100/50 dark:divide-slate-800/50">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === currentCountry.code
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-right text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">{country.flag}</span>
                      <div className="text-right">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {country.shortName}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {country.currencyName} ({country.currencySymbol})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {country.currency}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                لم يتم العثور على الدولة
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] text-center text-slate-400 dark:text-slate-500">
            🇸🇦 🇪🇬 🇦🇪 🇰🇼 🇶🇦 🇧🇭 🇴🇲 🇯🇴 🇮🇶 🇲🇦 🇩🇿 🇹🇳 🇱🇾 🇸🇩 🇱🇧 🇵🇸 🇾🇪
          </div>
        </div>
      )}
    </div>
  )
}
