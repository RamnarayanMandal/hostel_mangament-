"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showSuccess, showError } from '@/lib/sweetAlert'
import { useVerifyEmailOTP, useResendEmailOTP } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { 
  Scale, 
  StaggerContainer, 
  StaggerItem, 
  HoverLift, 
  FadeIn,
  Pulse
} from '@/components/ui/motion'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'

// Zod validation schema
const otpSchema = z.object({
  otp: z.string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers')
})


const OTPVerification = () => {
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const [userData, setUserData] = useState<{ email: string; phoneNumber: string } | null>(null)
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get user data from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('signupUserData')
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData)
        setUserData(parsedData)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
      }
    }
  }, [])

  // React Query mutations
  const verifyOTPMutation = useVerifyEmailOTP()
  const resendOTPMutation = useResendEmailOTP()

  // Formik form
  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: toFormikValidationSchema(otpSchema),
    onSubmit: (values) => {
      setShowValidationErrors(true)
      verifyOTPMutation.mutate({ 
        otp: values.otp,
        email: userData?.email || '',
       
      })
    }
  })

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Handle OTP input changes
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOTP = formik.values.otp.split('')
    newOTP[index] = value
    const otpString = newOTP.join('')
    
    formik.setFieldValue('otp', otpString)
    
    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Move to previous input if backspace and current is empty
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !formik.values.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle success and error messages
  React.useEffect(() => {
    if (verifyOTPMutation.isSuccess) {
      // Clear signup data from localStorage
      localStorage.removeItem('signupUserData')
      
      showSuccess(
        'Email Verified Successfully!',
        'Your email has been verified successfully. You can now login to your account.'
      )
      
      // Redirect to login page after verification
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    }
  }, [verifyOTPMutation.isSuccess, verifyOTPMutation.data, router])

  React.useEffect(() => {
    if (verifyOTPMutation.isError) {
      showError(
        'Verification Failed',
        verifyOTPMutation.error?.message || 'Invalid OTP. Please try again.'
      )
    }
  }, [verifyOTPMutation.isError, verifyOTPMutation.error])

  React.useEffect(() => {
    if (resendOTPMutation.isSuccess) {
      showSuccess(
        'OTP Resent Successfully!',
        'A new OTP has been sent to your email.'
      )
      setCountdown(60)
      setIsResending(false)
    }
  }, [resendOTPMutation.isSuccess])

  React.useEffect(() => {
    if (resendOTPMutation.isError) {
      showError(
        'Resend Failed',
        resendOTPMutation.error?.message || 'Failed to resend OTP. Please try again.'
      )
      setIsResending(false)
    }
  }, [resendOTPMutation.isError, resendOTPMutation.error])

  // Handle resend OTP
  const handleResendOTP = () => {
    setIsResending(true)
    resendOTPMutation.mutate({ email: userData?.email || '' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Scale className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <StaggerItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="absolute top-4 left-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </StaggerItem>
            <StaggerItem>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
            </StaggerItem>
            <StaggerItem>
              <CardDescription className="text-center">
                We&apos;ve sent a 6-digit verification code to your email address
                {userData?.email && (
                  <div className="mt-2 text-sm text-gray-600">
                    Email: {userData.email}
                  </div>
                )}
              </CardDescription>
            </StaggerItem>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <StaggerContainer>
                {/* OTP Input Fields */}
                <StaggerItem>
                  <Label htmlFor="otp" className="text-center block mb-4">
                    Enter the 6-digit code
                  </Label>
                  <div className="flex justify-center space-x-2 mb-4">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el }}
                        type="text"
                        maxLength={1}
                        className={`w-12 h-12 text-center text-lg font-semibold ${
                          (showValidationErrors || formik.touched.otp) && formik.errors.otp
                            ? 'border-red-500 bg-red-50'
                            : 'focus:border-blue-500'
                        }`}
                        value={formik.values.otp[index] || ''}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onBlur={formik.handleBlur}
                      />
                    ))}
                  </div>
                  {(showValidationErrors || formik.touched.otp) && formik.errors.otp && (
                    <FadeIn className="text-sm text-red-500 flex items-center justify-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {formik.errors.otp}
                    </FadeIn>
                  )}
                </StaggerItem>

                {/* Verify Button */}
                <StaggerItem>
                  <HoverLift>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={verifyOTPMutation.isPending || formik.values.otp.length !== 6}
                    >
                      {verifyOTPMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <Pulse>
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </Pulse>
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        'Verify Email'
                      )}
                    </Button>
                  </HoverLift>
                </StaggerItem>

                {/* Resend OTP */}
                <StaggerItem className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isResending}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {isResending ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Resending...</span>
                      </div>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      'Resend Code'
                    )}
                  </Button>
                </StaggerItem>

                {/* Back to Login */}
                <StaggerItem className="text-center text-sm">
                  <a href="/auth/login" className="text-blue-600 hover:underline">
                    Back to login
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

export default OTPVerification
