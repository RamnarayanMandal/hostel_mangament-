import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/teacher', 
  '/student',
  '/dashboard',
  '/profile',
  '/bookings',
  '/complaints',
  '/payments',
  '/hostel-management'
]

// Define auth routes (login, signup, etc.)
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forget-password',
  '/auth/opt-vefication'
]

// Function to check if route is protected
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

// Function to check if route is auth route
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route))
}

// Function to check if user is authenticated (basic check)
function isAuthenticated(request: NextRequest): boolean {
  // Check for token in cookies or headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  return !!token
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }

  // Handle auth routes - if user is already authenticated, redirect to appropriate dashboard
  if (isAuthRoute(pathname)) {
    if (isAuthenticated(request)) {
      // User is authenticated, redirect to their dashboard
      // We'll let the client-side handle the specific role-based redirect
      const dashboardUrl = new URL('/', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // Allow access to auth routes for unauthenticated users
    return NextResponse.next()
  }

  // Handle protected routes - only redirect if not authenticated
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated(request)) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Allow access to protected routes for authenticated users
    // Client-side ProtectedRoute will handle role-based access
    return NextResponse.next()
  }

  // Allow access to all other routes
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
