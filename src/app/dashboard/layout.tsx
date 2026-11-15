'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Cosmic Deep Space Nebula & Perspective Floor Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient Top Nebula */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent blur-3xl" />
        {/* Subtle Star Points */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:64px_64px] opacity-15" />
        {/* Bottom Perspective Floor Glow */}
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-cyan-950/20 via-slate-950/60 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-32 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.12),transparent_70%)]" />
      </div>

      {/* Sliding HUD Navigation Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Floating HUD Top Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Full-Width Panoramic Content Area - NO SIDEBAR PUSHING OR SQUEEZING */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {children}
      </main>
    </div>
  )
}
