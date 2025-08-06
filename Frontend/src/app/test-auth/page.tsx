"use client"

import { useEffect, useState } from 'react'
import { isAuthenticated, getUserRole, getUser, getToken } from '@/lib/auth'

export default function TestAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null as string | null,
    user: null as any,
    token: null as string | null
  })

  useEffect(() => {
    setAuthState({
      isAuthenticated: isAuthenticated(),
      userRole: getUserRole(),
      user: getUser(),
      token: getToken()
    })
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Authentication State:</h2>
          <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Quick Links:</h2>
          <div className="mt-2 space-x-2">
            <a href="/admin" className="text-blue-600 hover:underline">Admin Dashboard</a>
            <a href="/teacher" className="text-blue-600 hover:underline">Teacher Dashboard</a>
            <a href="/student" className="text-blue-600 hover:underline">Student Dashboard</a>
            <a href="/auth/login" className="text-blue-600 hover:underline">Login</a>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Test Redirects:</h2>
          <div className="mt-2 space-x-2">
            <a href="/auth/login?redirect=%2Fadmin" className="text-blue-600 hover:underline">
              Login with Admin Redirect
            </a>
            <a href="/auth/login?redirect=%2Fteacher" className="text-blue-600 hover:underline">
              Login with Teacher Redirect
            </a>
            <a href="/auth/login?redirect=%2Fstudent" className="text-blue-600 hover:underline">
              Login with Student Redirect
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 