import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

    // Create client for public aggregate counts
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parallel aggregate count queries (fast & safe - no private data returned)
    const [
      usersResult,
      tasksResult,
      habitsResult,
      subsResult,
      templatesResult,
      cmsResult,
      plansResult,
    ] = await Promise.allSettled([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('is_completed', true),
      supabase.from('habits').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('schedule_templates').select('*', { count: 'exact', head: true }),
      supabase.from('site_settings').select('value').eq('key', 'landing_page_content').maybeSingle(),
      supabase.from('subscription_plans').select('*').eq('is_active', true).order('price_monthly', { ascending: true }),
    ])

    const realStats = {
      total_users: usersResult.status === 'fulfilled' ? usersResult.value.count || 0 : 0,
      completed_tasks: tasksResult.status === 'fulfilled' ? tasksResult.value.count || 0 : 0,
      tracked_habits: habitsResult.status === 'fulfilled' ? habitsResult.value.count || 0 : 0,
      active_subscriptions: subsResult.status === 'fulfilled' ? subsResult.value.count || 0 : 0,
      available_templates: templatesResult.status === 'fulfilled' ? templatesResult.value.count || 0 : 0,
    }

    const cmsContent =
      cmsResult.status === 'fulfilled' && cmsResult.value?.data?.value
        ? cmsResult.value.data.value
        : null

    const plans =
      plansResult.status === 'fulfilled' && plansResult.value?.data
        ? plansResult.value.data
        : []

    return NextResponse.json(
      {
        success: true,
        stats: realStats,
        cms: cmsContent,
        plans: plans,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching landing stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to aggregate public statistics',
        stats: {
          total_users: 0,
          completed_tasks: 0,
          tracked_habits: 0,
          active_subscriptions: 0,
          available_templates: 0,
        },
      },
      { status: 200 } // return 200 with fallback so client never crashes
    )
  }
}
