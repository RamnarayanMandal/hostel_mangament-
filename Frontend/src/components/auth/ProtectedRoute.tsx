"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUserRole } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push(redirectTo)
        return
      }

      // If no specific roles are required, allow access
      if (allowedRoles.length === 0) {
        setHasAccess(true)
        setIsLoading(false)
        return
      }

      // Check if user has required role
      const userRole = getUserRole()
      if (!userRole || !allowedRoles.includes(userRole.toLowerCase())) {
        // Redirect to appropriate dashboard based on user's actual role
        const userRoleLower = userRole?.toLowerCase()
        let redirectPath = '/'
        
        switch (userRoleLower) {
          case 'admin':
            redirectPath = '/admin'
            break
          case 'teacher':
            redirectPath = '/teacher'
            break
          case 'student':
            redirectPath = '/student'
            break
          default:
            redirectPath = redirectTo
        }
        
        router.push(redirectPath)
        return
      }

      setHasAccess(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, allowedRoles, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
} 