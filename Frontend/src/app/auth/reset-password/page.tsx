"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card'
import { showSuccess, showError } from '@/lib/sweetAlert'
import { useResetPassword } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Scale, 
  StaggerContainer, 
  StaggerItem, 
  HoverLift, 
  FadeIn,
  Pulse
} from '@/components/ui/motion'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

// Zod validation schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Component that uses useSearchParams
const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Try multiple methods to get the token
  let token = searchParams.get('token')
  
  // Fallback: extract token from URL if searchParams doesn't work
  if (!token && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    token = urlParams.get('token')
  }
  
  // Another fallback: extract from URL path
  if (!token && typeof window !== 'undefined') {
    const url = window.location.href
    const tokenMatch = url.match(/[?&]token=([^&]+)/)
    if (tokenMatch) {
      token = tokenMatch[1]
    }
  }
  
  console.log('Reset Password Page - Token from URL:', token)
  console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR')
  console.log('Search params:', searchParams.toString())

  // React Query mutations
  const resetPasswordMutation = useResetPassword();

  // Formik form
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: toFormikValidationSchema(resetPasswordSchema),
    onSubmit: (values) => {
      setShowValidationErrors(true)
      if (token) {
        resetPasswordMutation.mutate({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        })
      }
    }
  })

  // Check token validity on component mount
  useEffect(() => {
    const validateToken = async () => {
      console.log('Validating token:', token)
      
      if (!token) {
        console.log('No token found in URL')
        showError('Invalid Reset Link', 'This password reset link is invalid or has expired.')
        setIsLoading(false)
        return
      }

      try {
        // You can add token validation logic here if needed
        // For now, we'll assume the token is valid if it exists
        setIsTokenValid(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Token validation error:', error)
        showError('Invalid Reset Link', 'This password reset link is invalid or has expired.')
        setIsLoading(false)
      }
    }

    validateToken()
  }, [token])

  // Handle reset password success
  React.useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      showSuccess('Password Reset Successful', 'Your password has been reset successfully. You can now log in with your new password.')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    }
  }, [resetPasswordMutation.isSuccess, router])

  // Handle reset password error
  React.useEffect(() => {
    if (resetPasswordMutation.isError) {
      const errorMessage = resetPasswordMutation.error?.message || 
                          resetPasswordMutation.error?.response?.data?.message || 
                          'Failed to reset password. Please try again.'
      showError('Password Reset Failed', errorMessage)
    }
  }, [resetPasswordMutation.isError, resetPasswordMutation.error])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <StaggerContainer className="w-full max-w-md">
          <Scale>
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <StaggerItem>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                </StaggerItem>
                <StaggerItem>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-gray-600 mb-6">
                    This password reset link is invalid or has expired. Please request a new password reset link.
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <Button
                    onClick={() => router.push('/auth/forget-Password')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Request New Reset Link
                  </Button>
                </StaggerItem>
              </CardContent>
            </Card>
          </Scale>
        </StaggerContainer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <StaggerContainer className="w-full max-w-md">
        <Scale>
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-8">
              <StaggerItem>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Reset Your Password
                </CardTitle>
              </StaggerItem>
              <StaggerItem>
                <CardDescription className="text-center text-gray-600">
                  Enter your new password below
                </CardDescription>
              </StaggerItem>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <StaggerItem>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {showValidationErrors && formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                    )}
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {showValidationErrors && formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                    )}
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Resetting password...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </StaggerItem>
              </form>

              <StaggerItem className="text-center text-sm">
                Remember your password?{' '}
                <a href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </a>
              </StaggerItem>
            </CardContent>
          </Card>
        </Scale>
      </StaggerContainer>
    </div>
  )
}

// Loading component for Suspense fallback
const ResetPasswordLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
    <div className="w-full max-w-md">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Main component with Suspense boundary
const ResetPassword = () => {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  )
}

export default ResetPassword
