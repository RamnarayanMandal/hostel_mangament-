"use client"

import React, { useState } from 'react'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { showSuccess, showError } from '@/lib/sweetAlert'
import { useSignup, useFirebaseAuth } from '@/hooks/useAuth'
import { useFirebaseAuth as useFirebaseAuthHook } from '@/hooks/useFirebaseAuth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Scale,
  StaggerContainer,
  StaggerItem,
  HoverLift,
  FadeIn,
  Pulse,

} from '@/components/ui/motion'

// Zod validation schema
const signupSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phoneNumber: z.string()
    .regex(/^[6-9]\d{9}$/, 'Phone number must be 10 digits starting with 6-9'),
  gender: z.enum(['male', 'female', 'other']),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type SignupFormData = z.infer<typeof signupSchema>

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const router = useRouter();


  // React Query mutations using custom hooks
  const signupMutation = useSignup()
  const firebaseAuthMutation = useFirebaseAuth()
  const { signInWithGoogle } = useFirebaseAuthHook()

  // Formik form
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      gender: 'male' as const,
      agreeToTerms: false
    },
    validationSchema: toFormikValidationSchema(signupSchema),
    onSubmit: (values) => {
      setIsFormSubmitted(true)
      setShowValidationErrors(true)
      const { confirmPassword, agreeToTerms, ...userData } = values
      // Add STUDENT role by default and include confirmPassword
      const signupData = { ...userData, confirmPassword, role: 'student' as const }
      signupMutation.mutate(signupData)
    }
  })

  // Handle success and error messages
  React.useEffect(() => {
    if (signupMutation.isSuccess) {
      // Save user data to localStorage for OTP verification
      const userData = {
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber
      }
      localStorage.setItem('signupUserData', JSON.stringify(userData))
      
      showSuccess(
        'Account Created Successfully!',
        'Redirecting to OTP verification...'
      )
      setTimeout(() => {
        router.push('/auth/opt-vefication')
      }, 2000)
    }
  }, [signupMutation.isSuccess, router, formik.values.email, formik.values.phoneNumber])

  React.useEffect(() => {
    if (signupMutation.isError) {
      console.log('Signup error detected:', signupMutation.error)
      showError(
        'Signup Failed',
        signupMutation.error?.message || 'Failed to create account. Please try again.'
      )
    }
  }, [signupMutation.isError, signupMutation.error])

  React.useEffect(() => {
    if (firebaseAuthMutation.isSuccess) {
      // Save user data to localStorage for OTP verification
      const userData = {
        email: firebaseAuthMutation.data?.data?.user?.email || '',
        phoneNumber: '' // Google auth doesn't provide phone number
      }
      localStorage.setItem('signupUserData', JSON.stringify(userData))
      
      showSuccess(
        'Google Signup Successful!',
        'Redirecting to dashboard...'
      )
      setTimeout(() => {
        router.push('/auth/opt-vefication')
      }, 2000)
    }
  }, [firebaseAuthMutation.isSuccess, router, firebaseAuthMutation.data])

  React.useEffect(() => {
    if (firebaseAuthMutation.isError) {
      showError(
        'Google Signup Failed',
        firebaseAuthMutation.error?.message || 'Failed to sign up with Google. Please try again.'
      )
    }
  }, [firebaseAuthMutation.isError, firebaseAuthMutation.error])

  // Handle Firebase Google signup
  const handleFirebaseGoogleSignup = async () => {
    try {
      const firebaseUser = await signInWithGoogle()
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken()
        firebaseAuthMutation.mutate(idToken)

        router.push("/")
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
              <CardTitle className="text-2xl font-bold text-center">Create Student Account</CardTitle>
            </StaggerItem>
            <StaggerItem>
              <CardDescription className="text-center">
                Join our hostel community and start your journey
              </CardDescription>
            </StaggerItem>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <StaggerContainer>
                {/* Google Signup Button */}
                <StaggerItem>
                  <HoverLift>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleFirebaseGoogleSignup}
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
                          <span>Signing up with Google...</span>
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

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <StaggerItem className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`pl-10 transition-all duration-200 ${(showValidationErrors || formik.touched.firstName) && formik.errors.firstName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'focus:border-blue-500'}`}
                      />
                    </div>
                                         {(showValidationErrors || formik.touched.firstName) && formik.errors.firstName && (
                       <FadeIn className="text-sm text-red-500 flex items-center gap-1">
                         <span className="text-red-500">⚠️</span>
                         {formik.errors.firstName}
                       </FadeIn>
                     )}
                    
                  </StaggerItem>
                  <StaggerItem className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                                             className={`transition-all duration-200 ${(showValidationErrors || formik.touched.lastName) && formik.errors.lastName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'focus:border-blue-500'}`}
                    />
                                         {(showValidationErrors || formik.touched.lastName) && formik.errors.lastName && (
                       <FadeIn className="text-sm text-red-500 flex items-center gap-1">
                         <span className="text-red-500">⚠️</span>
                         {formik.errors.lastName}
                       </FadeIn>
                     )}
                     
                  </StaggerItem>
                </div>

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
                </StaggerItem>

                {/* Phone Number */}
                <StaggerItem className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <p className="text-xs text-gray-500">Enter 10-digit mobile number (e.g., 9876543210)</p>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="9876543210"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                                             className={`pl-10 transition-all duration-200 ${(showValidationErrors || formik.touched.phoneNumber) && formik.errors.phoneNumber ? 'border-red-500 focus:border-red-500 bg-red-50' : 'focus:border-blue-500'}`}
                    />
                  </div>
                                     {(showValidationErrors || formik.touched.phoneNumber) && formik.errors.phoneNumber && (
                     <FadeIn className="text-sm text-red-500 flex items-center gap-1">
                       <span className="text-red-500">⚠️</span>
                       {formik.errors.phoneNumber}
                     </FadeIn>
                   )}
                </StaggerItem>

                {/* Gender */}
                <StaggerItem className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formik.values.gender}
                    onValueChange={(value) => formik.setFieldValue('gender', value)}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:border-blue-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </StaggerItem>

                {/* Password Fields */}
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
                </StaggerItem>

                <StaggerItem className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                                             className={`pl-10 pr-10 transition-all duration-200 ${(showValidationErrors || formik.touched.confirmPassword) && formik.errors.confirmPassword ? 'border-red-500 focus:border-red-500 bg-red-50' : 'focus:border-blue-500'}`}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                  </div>
                                     {(showValidationErrors || formik.touched.confirmPassword) && formik.errors.confirmPassword && (
                     <FadeIn className="text-sm text-red-500 flex items-center gap-1">
                       <span className="text-red-500">⚠️</span>
                       {formik.errors.confirmPassword}
                     </FadeIn>
                   )}
                </StaggerItem>

                {/* Terms and Conditions */}
                <StaggerItem className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onCheckedChange={(checked) => formik.setFieldValue('agreeToTerms', checked)}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>
                  </Label>
                </StaggerItem>
                                 {(showValidationErrors || formik.touched.agreeToTerms) && formik.errors.agreeToTerms && (
                   <FadeIn className="text-sm text-red-500 flex items-center gap-1">
                     <span className="text-red-500">⚠️</span>
                     {formik.errors.agreeToTerms}
                   </FadeIn>
                 )}



                {/* Submit Button */}
                <StaggerItem>
                  <HoverLift>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={signupMutation.isPending}
                    >
                      {signupMutation.isPending ? 'Creating Account...' : 'Create Student Account'}
                    </Button>
                  </HoverLift>
                </StaggerItem>

                {/* Login Link */}
                <StaggerItem className="text-center text-sm">
                  Already have an account?{' '}
                  <a href="/auth/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
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

export default SignUp
