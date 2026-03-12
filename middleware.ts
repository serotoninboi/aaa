import { updateSession } from '@/lib/supabase-middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Define protected and auth routes
const protectedRoutes = ['/studio', '/image-edit', '/pose-edit', '/pricing']
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Update Supabase session
  const response = await updateSession(request)

  // Check for Supabase session cookie
  const supabaseSession = request.cookies.get('sb-session')?.value
  const isAuthenticated = !!supabaseSession

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/studio', request.url))
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/images|favicon.ico|.*\\..*).*)',
  ],
}
