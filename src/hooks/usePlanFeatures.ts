'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export interface PlanFeatureLimits {
  max_schedules: number
  max_tasks_per_day: number
  habits_enabled: boolean
  analytics_enabled: boolean
  streaks_enabled: boolean
  templates_enabled: boolean
  export_pdf_enabled: boolean
  priority_support: boolean
}

const DEFAULT_FREE_LIMITS: PlanFeatureLimits = {
  max_schedules: 1,
  max_tasks_per_day: 10,
  habits_enabled: false,
  analytics_enabled: false,
  streaks_enabled: false,
  templates_enabled: false,
  export_pdf_enabled: false,
  priority_support: false,
}

const DEFAULT_PRO_LIMITS: PlanFeatureLimits = {
  max_schedules: 999,
  max_tasks_per_day: 999,
  habits_enabled: true,
  analytics_enabled: true,
  streaks_enabled: true,
  templates_enabled: true,
  export_pdf_enabled: true,
  priority_support: true,
}

export function usePlanFeatures() {
  const { user, isAdmin } = useAuth()
  const supabase = createClient()

  const [hasActiveSub, setHasActiveSub] = useState<boolean>(false)
  const [featureConfig, setFeatureConfig] = useState<{
    free: PlanFeatureLimits
    pro: PlanFeatureLimits
  }>({
    free: DEFAULT_FREE_LIMITS,
    pro: DEFAULT_PRO_LIMITS,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    const loadPlanFeaturesAndUserSub = async () => {
      try {
        // 1. Fetch feature config from site_settings
        const { data: configData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'plan_features')
          .maybeSingle()

        if (configData?.value && isMounted) {
          const val = configData.value as any
          setFeatureConfig({
            free: { ...DEFAULT_FREE_LIMITS, ...(val.free || {}) },
            pro: { ...DEFAULT_PRO_LIMITS, ...(val.pro || {}) },
          })
        }

        // 2. Fetch user's active subscription if logged in
        if (user) {
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('id, status, end_date')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .gt('end_date', new Date().toISOString())
            .limit(1)

          if (isMounted) {
            setHasActiveSub(!!(subData && subData.length > 0))
          }
        }
      } catch (err) {
        console.error('Failed to load plan features:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPlanFeaturesAndUserSub()

    return () => {
      isMounted = false
    }
  }, [user])

  // If user is Admin or has active subscription, grant Pro features
  const isPro = isAdmin || hasActiveSub
  const currentLimits = isPro ? featureConfig.pro : featureConfig.free

  return {
    isPro,
    hasActiveSub,
    isAdmin,
    isLoading,
    limits: currentLimits,
    allConfig: featureConfig,
    canAccessHabits: currentLimits.habits_enabled,
    canAccessAnalytics: currentLimits.analytics_enabled,
    canAccessStreaks: currentLimits.streaks_enabled,
    canAccessTemplates: currentLimits.templates_enabled,
    canExportPdf: currentLimits.export_pdf_enabled,
    maxSchedules: currentLimits.max_schedules,
    maxDailyTasks: currentLimits.max_tasks_per_day,
  }
}
