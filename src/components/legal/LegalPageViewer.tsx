'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import { Sparkles, ArrowRight, Sun, Moon } from 'lucide-react'

interface LegalPageViewerProps {
  slug: string
  defaultTitle: string
  defaultContent: string
}

export function LegalPageViewer({
  slug,
  defaultTitle,
  defaultContent,
}: LegalPageViewerProps) {
  const { theme, toggleTheme } = useTheme()
  const supabase = createClient()

  const [title, setTitle] = useState(defaultTitle)
  const [content, setContent] = useState(defaultContent)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const { data } = await supabase
          .from('legal_pages')
          .select('title, content')
          .eq('slug', slug)
          .eq('is_published', true)
          .single()

        if (data) {
          setTitle(data.title)
          setContent(data.content)
        }
      } catch (err) {
        // Fallback to default
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [slug])

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-950 flex flex-col justify-between">
      {/* Header */}
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

      {/* Content */}
      <main className="max-w-4xl w-full mx-auto p-6 sm:p-10 my-8 flex-1">
        <Card className="p-8 sm:p-12 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            {title}
          </h1>

          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
            {content}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} فكرتو (Fekrto). جميع الحقوق محفوظة.
      </footer>
    </div>
  )
}
