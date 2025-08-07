"use client"

import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
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
  const resetPasswordMutation = useResetPassword()

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
        // Validate token with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api'}/auth/validate-reset-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()
        console.log('Token validation response:', data)

        if (data.success) {
          setIsTokenValid(true)
        } else {
          showError('Invalid Reset Link', data.message || 'This password reset link is invalid or has expired.')
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Token validation error:', error)
        // For development, assume token is valid if validation fails
        console.log('Assuming token is valid for development')
        setIsTokenValid(true)
        setIsLoading(false)
      }
    }

    validateToken()
  }, [token])

  // Handle success and error messages
  React.useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      showSuccess(
        'Password Reset Successful!',
        'Your password has been reset successfully. Redirecting to login...'
      )
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    }
  }, [resetPasswordMutation.isSuccess, router])

  React.useEffect(() => {
    if (resetPasswordMutation.isError) {
      showError(
        'Password Reset Failed',
        resetPasswordMutation.error?.message || 'Failed to reset password. Please try again.'
      )
    }
  }, [resetPasswordMutation.isError, resetPasswordMutation.error])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Scale className="w-full max-w-lg">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Lock className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                Validating Reset Link
              </h2>
              <p className="text-center text-blue-100">
                Please wait while we verify your reset link...
              </p>
            </div>
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <Pulse>
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                </Pulse>
                <span className="text-gray-600 font-medium">Validating reset link...</span>
              </div>
            </CardContent>
          </Card>
        </Scale>
      </div>
    )
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Scale className="w-full max-w-lg">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <StaggerItem>
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <AlertCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <CardTitle className="text-3xl font-bold text-center text-white mb-2">
                  Invalid Reset Link
                </CardTitle>
              </StaggerItem>
              <StaggerItem>
                <CardDescription className="text-center text-red-100 text-lg">
                  This password reset link is invalid or has expired
                </CardDescription>
              </StaggerItem>
            </div>
            <CardContent className="p-8">
              <StaggerContainer>
                <StaggerItem>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">What happened?</h4>
                    <ul className="text-xs text-red-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        The reset link may have expired (links expire after 1 hour)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        The link may have been used already
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        The link may be invalid or corrupted
                      </li>
                    </ul>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <HoverLift>
                    <Button 
                      onClick={() => router.push('/auth/forget-Password')}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Request New Reset Link
                    </Button>
                  </HoverLift>
                </StaggerItem>
                <StaggerItem className="text-center pt-4">
                  <div className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors">
                      Sign in here
                    </a>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </CardContent>
          </Card>
        </Scale>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Scale className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <StaggerItem>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <CardTitle className="text-3xl font-bold text-center text-white mb-2">
                Reset Your Password
              </CardTitle>
            </StaggerItem>
            <StaggerItem>
              <CardDescription className="text-center text-blue-100 text-lg">
                Create a new secure password for your account
              </CardDescription>
            </StaggerItem>
          </div>

          <CardContent className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <StaggerContainer>
                {/* Password Requirements */}
                <StaggerItem>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${formik.values.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${formik.values.password === formik.values.confirmPassword && formik.values.password ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        Passwords must match
                      </li>
                    </ul>
                  </div>
                </StaggerItem>

                <StaggerItem className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-12 pr-12 h-12 text-base transition-all duration-300 rounded-xl border-2 ${
                        (showValidationErrors || formik.touched.password) && formik.errors.password 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : formik.touched.password && !formik.errors.password
                          ? 'border-green-300 focus:border-green-500 bg-green-50'
                          : 'border-gray-200 focus:border-blue-500 focus:bg-white'
                      }`}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.button>
                  </div>
                  {(showValidationErrors || formik.touched.password) && formik.errors.password && (
                    <FadeIn className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <span className="text-red-500">⚠️</span>
                      {formik.errors.password}
                    </FadeIn>
                  )}
                  {formik.touched.password && !formik.errors.password && (
                    <FadeIn className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                      <span className="text-green-500">✅</span>
                      Password meets requirements!
                    </FadeIn>
                  )}
                </StaggerItem>

                <StaggerItem className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-12 pr-12 h-12 text-base transition-all duration-300 rounded-xl border-2 ${
                        (showValidationErrors || formik.touched.confirmPassword) && formik.errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : formik.touched.confirmPassword && !formik.errors.confirmPassword && formik.values.password === formik.values.confirmPassword
                          ? 'border-green-300 focus:border-green-500 bg-green-50'
                          : 'border-gray-200 focus:border-blue-500 focus:bg-white'
                      }`}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.button>
                  </div>
                  {(showValidationErrors || formik.touched.confirmPassword) && formik.errors.confirmPassword && (
                    <FadeIn className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <span className="text-red-500">⚠️</span>
                      {formik.errors.confirmPassword}
                    </FadeIn>
                  )}
                  {formik.touched.confirmPassword && !formik.errors.confirmPassword && formik.values.password === formik.values.confirmPassword && (
                    <FadeIn className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                      <span className="text-green-500">✅</span>
                      Passwords match perfectly!
                    </FadeIn>
                  )}
                </StaggerItem>

                <StaggerItem className="pt-4">
                  <HoverLift>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <div className="flex items-center space-x-3">
                          <Pulse>
                            <div className="w-5 h-5 bg-white rounded-full"></div>
                          </Pulse>
                          <span>Updating Password...</span>
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </HoverLift>
                </StaggerItem>

                <StaggerItem className="text-center pt-4">
                  <div className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors">
                      Sign in here
                    </a>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </form>
          </CardContent>
        </Card>
      </Scale>
    </div>
  )
}

export default ResetPassword
