import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              maxAge: 60 * 60 * 24 * 365, // 1 year persistent cookie
              sameSite: 'lax',
              path: '/',
            })
          )
        },
      },
    })

    // Refresh auth token if expired
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isPlaceholder = supabaseUrl.includes('placeholder')

    if (!isPlaceholder) {
      // 1. Strict Server/Edge Protection: /admin routes
      if (pathname.startsWith('/admin')) {
        if (!user) {
          const loginUrl = new URL('/auth/login', request.url)
          loginUrl.searchParams.set('next', pathname)
          const redirectRes = NextResponse.redirect(loginUrl)
          supabaseResponse.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value, c))
          return redirectRes
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
          const dashUrl = new URL('/dashboard', request.url)
          const redirectRes = NextResponse.redirect(dashUrl)
          supabaseResponse.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value, c))
          return redirectRes
        }
      }

      // 2. Strict Server/Edge Protection: /dashboard routes
      if (pathname.startsWith('/dashboard')) {
        if (!user) {
          const loginUrl = new URL('/auth/login', request.url)
          loginUrl.searchParams.set('next', pathname)
          const redirectRes = NextResponse.redirect(loginUrl)
          supabaseResponse.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value, c))
          return redirectRes
        }
      }

      // 3. Authenticated user visiting /auth/login or /auth/register -> redirect to dashboard
      if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
        const dashUrl = new URL('/dashboard', request.url)
        const redirectRes = NextResponse.redirect(dashUrl)
        supabaseResponse.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value, c))
        return redirectRes
      }
    }
  } catch (err) {
    // Graceful error handling for missing or invalid session
  }

  return supabaseResponse
}
