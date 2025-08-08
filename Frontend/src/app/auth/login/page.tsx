"use client"

import React, { useState } from 'react'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { showSuccess, showError } from '@/lib/sweetAlert'
import { useLogin, useFirebaseAuth } from '@/hooks/useAuth'
import { useFirebaseAuth as useFirebaseAuthHook } from '@/hooks/useFirebaseAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { setAuthData } from '@/lib/auth'
import { 
  Scale, 
  StaggerContainer, 
  StaggerItem, 
  HoverLift, 
  FadeIn,
  Pulse
} from '@/components/ui/motion'

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})



const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  // React Query mutations using custom hooks
  const loginMutation = useLogin()
  const firebaseAuthMutation = useFirebaseAuth()
  const { signInWithGoogle } = useFirebaseAuthHook()

  // Formik form
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      setShowValidationErrors(true)
      const { ...loginData } = values
      loginMutation.mutate(loginData)
    }
  })

  // Handle success and error messages
  React.useEffect(() => {
    if (loginMutation.isSuccess) {
      const { token, user } = loginMutation.data?.data || {}
      
      if (token && user) {
        // Save auth data to localStorage
        setAuthData(token, user)
        
        // Get user role and redirect accordingly
        const userRole = user.role?.toLowerCase()
        let redirectPath = redirectTo
        
        console.log('Login Success - Debug Info:', {
          userRole,
          redirectTo,
          user: user.firstName,
          token: token ? 'Present' : 'Missing'
        })
        
        // If there's a specific redirect URL, use it (but validate it's appropriate for the user's role)
        if (redirectTo && redirectTo !== '/') {
          // Check if the redirect path is appropriate for the user's role
          const isAppropriateRedirect = (
            (userRole === 'admin' && redirectTo.startsWith('/admin')) ||
            (userRole === 'teacher' && redirectTo.startsWith('/teacher')) ||
            (userRole === 'student' && redirectTo.startsWith('/student'))
          )
          
          console.log('Redirect validation:', {
            isAppropriateRedirect,
            userRole,
            redirectTo
          })
          
          if (isAppropriateRedirect) {
            redirectPath = redirectTo
          } else {
            // If redirect is not appropriate for user's role, redirect to their default dashboard
            switch (userRole) {
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
                redirectPath = '/'
            }
          }
        } else {
          // No specific redirect, use role-based default
          switch (userRole) {
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
              redirectPath = '/'
          }
        }
        
        console.log('Final redirect path:', redirectPath)
        
        showSuccess(
          'Login Successful!',
          `Welcome back, ${user.firstName || 'User'}! Redirecting to ${userRole} dashboard...`
        )
        
        setTimeout(() => {
          router.push(redirectPath)
        }, 2000)
      }
    }
  }, [loginMutation.isSuccess, loginMutation.data, router, redirectTo])

  React.useEffect(() => {
    if (loginMutation.isError) {
      console.log('Login error detected:', loginMutation.error)
      console.log('Error message:', loginMutation.error?.message)
      console.log('Error response:', loginMutation.error?.response?.data)
      console.log('Full error object:', JSON.stringify(loginMutation.error, null, 2))
      
      // Check if it's an email verification error
      const errorMessage = loginMutation.error?.message || 
                          loginMutation.error?.response?.data?.message || 
                          (loginMutation.error?.response?.data && typeof loginMutation.error.response.data === 'string' ? loginMutation.error.response.data : '') || ''
      
      console.log('Extracted error message:', errorMessage)
      
      // Check for email verification error in multiple ways
      const isEmailVerificationError = 
        errorMessage.includes('Email verification required') ||
        errorMessage.includes('verify your email') ||
        errorMessage.includes('verification')
      
      if (isEmailVerificationError) {
        console.log('Email verification error detected, redirecting...')
        showError(
          'Email Verification Required',
          'Please verify your email before logging in. Redirecting to verification page...'
        )
        
        // Save email to localStorage for OTP verification page
        const email = formik.values.email
        localStorage.setItem('signupUserData', JSON.stringify({ email }))
        
        // Redirect to OTP verification page after a short delay
        setTimeout(() => {
          router.push('/auth/opt-vefication')
        }, 2000)
      } else {
        console.log('Regular login error, showing error message')
        showError(
          'Login Failed',
          errorMessage || 'Invalid email or password. Please try again.'
        )
      }
    }
  }, [loginMutation.isError, loginMutation.error, formik.values.email, router])

  React.useEffect(() => {
    if (firebaseAuthMutation.isSuccess) {
      const { token, user } = firebaseAuthMutation.data?.data || {}
      
      if (token && user) {
        // Save auth data to localStorage
        setAuthData(token, user)
        
        // Get user role and redirect accordingly
        const userRole = user.role?.toLowerCase()
        let redirectPath = redirectTo
        
        console.log('Firebase Login Success - Debug Info:', {
          userRole,
          redirectTo,
          user: user.firstName,
          token: token ? 'Present' : 'Missing'
        })
        
        // If there's a specific redirect URL, use it (but validate it's appropriate for the user's role)
        if (redirectTo && redirectTo !== '/') {
          // Check if the redirect path is appropriate for the user's role
          const isAppropriateRedirect = (
            (userRole === 'admin' && redirectTo.startsWith('/admin')) ||
            (userRole === 'teacher' && redirectTo.startsWith('/teacher')) ||
            (userRole === 'student' && redirectTo.startsWith('/student'))
          )
          
          console.log('Firebase Redirect validation:', {
            isAppropriateRedirect,
            userRole,
            redirectTo
          })
          
          if (isAppropriateRedirect) {
            redirectPath = redirectTo
          } else {
            // If redirect is not appropriate for user's role, redirect to their default dashboard
            switch (userRole) {
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
                redirectPath = '/'
            }
          }
        } else {
          // No specific redirect, use role-based default
          switch (userRole) {
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
              redirectPath = '/'
          }
        }
        
        console.log('Firebase Final redirect path:', redirectPath)
        
        showSuccess(
          'Google Login Successful!',
          `Welcome back, ${user.firstName || 'User'}! Redirecting to ${userRole} dashboard...`
        )
        
        setTimeout(() => {
          router.push(redirectPath)
        }, 2000)
      }
    }
  }, [firebaseAuthMutation.isSuccess, firebaseAuthMutation.data, router, redirectTo])

  React.useEffect(() => {
    if (firebaseAuthMutation.isError) {
      console.log('Firebase login error detected:', firebaseAuthMutation.error)
      
      // Check if it's an email verification error
      if (firebaseAuthMutation.error?.message?.includes('Email verification required')) {
        showError(
          'Email Verification Required',
          'Please verify your email before logging in. Redirecting to verification page...'
        )
        
        // For Firebase login, we might not have the email in formik, so we'll need to get it from the error or user
        // This is a fallback - ideally the email should be available
        const email = formik.values.email || 'user@example.com' // fallback
        localStorage.setItem('signupUserData', JSON.stringify({ email }))
        
        // Redirect to OTP verification page after a short delay
        setTimeout(() => {
          router.push('/auth/opt-vefication')
        }, 2000)
      } else {
        showError(
          'Google Login Failed',
          firebaseAuthMutation.error?.message || 'Failed to sign in with Google. Please try again.'
        )
      }
    }
  }, [firebaseAuthMutation.isError, firebaseAuthMutation.error, formik.values.email, router])

  // Handle Firebase Google login
  const handleFirebaseGoogleLogin = async () => {
    try {
      const firebaseUser = await signInWithGoogle()
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken()
        firebaseAuthMutation.mutate(idToken)
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Scale className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <StaggerItem>
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            </StaggerItem>
            <StaggerItem>
              <CardDescription className="text-center">
                Sign in to your account to continue
              </CardDescription>
            </StaggerItem>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <StaggerContainer>
                {/* Google Login Button */}
                <StaggerItem>
                  <HoverLift>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full"
                      onClick={handleFirebaseGoogleLogin}
                      disabled={firebaseAuthMutation.isPending}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      {firebaseAuthMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <Pulse>
                            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                          </Pulse>
                          <span>Signing in with Google...</span>
                        </div>
                      ) : (
                        'Continue with Google'
                      )}
                    </Button>
                  </HoverLift>
                </StaggerItem>

                {/* Divider */}
                <StaggerItem className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                  </div>
                </StaggerItem>

                {/* Email Field */}
                <StaggerItem className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-10 transition-all duration-200 ${(showValidationErrors || formik.touched.email) && formik.errors.email ? 'border-red-500 focus:border-red-500 bg-red-50' : 'focus:border-blue-500'}`}
                    />
                  </div>
                  {(showValidationErrors || formik.touched.email) && formik.errors.email && (
                    <FadeIn className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {formik.errors.email}
                    </FadeIn>
                  )}
                  {formik.touched.email && !formik.errors.email && (
                    <FadeIn className="text-sm text-green-500 flex items-center gap-1">
                      <span className="text-green-500">✅</span>
                      Email looks good!
                    </FadeIn>
                  )}
                </StaggerItem>

                {/* Password Field */}
                <StaggerItem className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-10 pr-10 transition-all duration-200 ${(showValidationErrors || formik.touched.password) && formik.errors.password ? 'border-red-500 focus:border-red-500 bg-red-50' : 'focus:border-blue-500'}`}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                  </div>
                  {(showValidationErrors || formik.touched.password) && formik.errors.password && (
                    <FadeIn className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {formik.errors.password}
                    </FadeIn>
                  )}
                  {formik.touched.password && !formik.errors.password && (
                    <FadeIn className="text-sm text-green-500 flex items-center gap-1">
                      <span className="text-green-500">✅</span>
                      Password looks good!
                    </FadeIn>
                  )}
                </StaggerItem>

                {/* Remember Me & Forgot Password */}
                <StaggerItem className="flex items-center justify-between my-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formik.values.rememberMe}
                      onCheckedChange={(checked) => formik.setFieldValue('rememberMe', checked)}
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <a href="/auth/forget-Password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (formik.values.email) {
                          // Call the resend OTP for login endpoint
                          fetch('/api/auth/resend-email-otp-for-login', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: formik.values.email }),
                          })
                          .then(response => response.json())
                          .then(data => {
                            if (data.success) {
                              showSuccess('Verification Code Sent', 'A new verification code has been sent to your email.')
                            } else {
                              showError('Error', data.message || 'Failed to send verification code.')
                            }
                          })
                          .catch(error => {
                            showError('Error', 'Failed to send verification code. Please try again.')
                          })
                        } else {
                          showError('Error', 'Please enter your email address first.')
                        }
                      }}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Resend verification code
                    </button>
                  </div>
                </StaggerItem>

                {/* Submit Button */}
                <StaggerItem>
                  <HoverLift>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </HoverLift>
                </StaggerItem>

                {/* Signup Link */}
                <StaggerItem className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </a>
                </StaggerItem>

               
              
              </StaggerContainer>
            </form>
          </CardContent>
        </Card>
      </Scale>
    </div>
  )
}

export default Login
