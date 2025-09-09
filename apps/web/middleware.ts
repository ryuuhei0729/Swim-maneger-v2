import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // セッションを取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // 認証が必要なルート
  const protectedRoutes = [
    '/dashboard',
    '/members',
    '/practice',
    '/competitions',
    '/records',
    '/goals',
    '/schedule',
    '/attendance',
    '/announcements',
    '/settings',
    '/profile'
  ]

  // 認証が不要なルート
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/reset-password',
    '/auth/callback'
  ]

  // 認証が必要なルートにアクセスしている場合
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // 認証が不要なルートにアクセスしている場合
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // 認証が必要なルートに未認証でアクセスした場合
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect_to', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 認証済みユーザーが認証不要なルートにアクセスした場合
  if (session && (pathname === '/login' || pathname === '/signup')) {
    const redirectTo = request.nextUrl.searchParams.get('redirect_to') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // 認証済みユーザーがルートページにアクセスした場合
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
