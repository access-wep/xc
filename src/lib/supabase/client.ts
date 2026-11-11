import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createBrowserClient(supabaseUrl, supabaseKey, {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 365, // 1 year persistent cookie
      sameSite: 'lax',
      path: '/',
    },
  })
}
