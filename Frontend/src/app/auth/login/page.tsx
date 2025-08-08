"use client"

import React, { useState, Suspense } from 'react'
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

// Component that uses useSearchParams
const LoginForm = () => {
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
            // If redirect is not appropriate, use default role-based redirect
            redirectPath = `/${userRole}`
          }
        } else {
          // Default role-based redirect
          redirectPath = `/${userRole}`
        }
        
        console.log('Final redirect path:', redirectPath)
        
        // Show success message and redirect
        showSuccess('Login Successful', `Welcome back, ${user.firstName}!`)
        router.push(redirectPath)
      }
    }
  }, [loginMutation.isSuccess, loginMutation.data, router, redirectTo])

  // Handle error messages
  React.useEffect(() => {
    if (loginMutation.isError) {
      // Check if it's an email verification error
      const errorMessage = loginMutation.error?.message || 
                          loginMutation.error?.response?.data?.message || 
                          (loginMutation.error?.response?.data && typeof loginMutation.error.response.data === 'string' ? loginMutation.error.response.data : '') || ''
      
      console.log('Extracted error message:', errorMessage)
      
      const isEmailVerificationError = 
        errorMessage.includes('Email verification required') ||
        errorMessage.includes('verify your email') ||
        errorMessage.includes('verification')
      
      if (isEmailVerificationError) {
        console.log('Email verification error detected, redirecting...')
        showError('Email Verification Required', 'Please verify your email address before logging in.')
        router.push('/auth/opt-vefication')
        return
      }
      
      // Handle other errors
      const displayMessage = errorMessage || 'Login failed. Please try again.'
      showError('Login Failed', displayMessage)
    }
  }, [loginMutation.isError, loginMutation.error, router])

  // Handle Firebase auth success
  React.useEffect(() => {
    if (firebaseAuthMutation.isSuccess) {
      const response = firebaseAuthMutation.data
      const token = response?.data?.token || response?.token
      const user = response?.data?.user || response?.user
      
      if (token && user) {
        setAuthData(token, user)
        const userRole = user.role?.toLowerCase()
        const redirectPath = redirectTo && redirectTo !== '/' ? redirectTo : `/${userRole}`
        
        showSuccess('Login Successful', `Welcome back, ${user.firstName}!`)
        router.push(redirectPath)
      }
    }
  }, [firebaseAuthMutation.isSuccess, firebaseAuthMutation.data, router, redirectTo])

  // Handle Firebase auth error
  React.useEffect(() => {
    if (firebaseAuthMutation.isError) {
      const errorMessage = firebaseAuthMutation.error?.message || 
                          firebaseAuthMutation.error?.response?.data?.message || 
                          'Firebase authentication failed'
      showError('Authentication Failed', errorMessage)
    }
  }, [firebaseAuthMutation.isError, firebaseAuthMutation.error])

  const handleFirebaseGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle()
      if (result) {
        // Get the ID token
        const idToken = await result.getIdToken()
        
        // Call the backend with the Firebase token
        firebaseAuthMutation.mutate(idToken)
      }
    } catch (error) {
      console.error('Firebase Google login error:', error)
      showError('Google Login Failed', 'Failed to sign in with Google. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <StaggerContainer className="w-full max-w-md">
        <Scale>
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-8">
              <StaggerItem>
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  Welcome Back
                </CardTitle>
              </StaggerItem>
              <StaggerItem>
                <CardDescription className="text-center text-gray-600">
                  Sign in to your account to continue
                </CardDescription>
              </StaggerItem>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Sign In Button */}
              <StaggerItem>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200"
                  onClick={handleFirebaseGoogleLogin}
                  disabled={firebaseAuthMutation.isPending}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {firebaseAuthMutation.isPending ? 'Signing in...' : 'Continue with Google'}
                </Button>
              </StaggerItem>

              {/* Divider */}
              <StaggerItem>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
              </StaggerItem>

              {/* Login Form */}
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <StaggerItem>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    {showValidationErrors && formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                    )}
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        checked={formik.values.rememberMe}
                        onCheckedChange={(checked) => formik.setFieldValue('rememberMe', checked)}
                        className="border-2 border-gray-300"
                      />
                      <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>
                    <a href="/auth/forget-Password" className="text-sm text-blue-600 hover:underline font-medium">
                      Forgot password?
                    </a>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </StaggerItem>
              </form>

              {/* Signup Link */}
              <StaggerItem className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
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
const LoginLoading = () => (
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
const Login = () => {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}

export default Login
