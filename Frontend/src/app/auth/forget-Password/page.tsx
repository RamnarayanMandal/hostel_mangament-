"use client"

import React, { useState } from 'react'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent  } from '@/components/ui/card'
import { showSuccess, showError } from '@/lib/sweetAlert'
import { useForgotPassword } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { 
  Scale, 
  StaggerContainer, 
  StaggerItem, 
  HoverLift, 
  FadeIn,
  Pulse
} from '@/components/ui/motion'
import { Mail, ArrowLeft, Lock } from 'lucide-react'

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})


const ForgotPassword = () => {
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  const router = useRouter()

  // React Query mutations
  const forgotPasswordMutation = useForgotPassword()

  // Formik form for email
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: toFormikValidationSchema(forgotPasswordSchema),
    onSubmit: (values) => {
      setShowValidationErrors(true)
      forgotPasswordMutation.mutate(values)
    }
  })

  // Handle success and error messages
  React.useEffect(() => {
    if (forgotPasswordMutation.isSuccess) {
      showSuccess(
        'Reset Link Sent!',
        'A password reset link has been sent to your email address. Please check your inbox.'
      )
      router.push('/auth/login');
     
    }
  }, [forgotPasswordMutation.isSuccess, router]);

  React.useEffect(() => {
    if (forgotPasswordMutation.isError) {
      showError(
        'Failed to Send Reset Link',
        forgotPasswordMutation.error?.message || 'Please check your email address and try again.'
      )
    }
  }, [forgotPasswordMutation.isError, forgotPasswordMutation.error])

 
 




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Scale className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
            <StaggerItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="absolute top-4 left-4 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </StaggerItem>
            
            <StaggerItem>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Lock className="h-10 w-10 text-white" />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <h1 className="text-3xl font-bold text-center text-white mb-2">
                Forgot Password?
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-center text-blue-100 text-lg">
                Enter your email to receive a password reset link
              </p>
            </StaggerItem>
          </div>

          <CardContent className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <StaggerContainer>
                {/* Instructions */}
                <StaggerItem>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">How it works:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Enter your email address below
                      </li>
                                                        <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    We&apos;ll send you a secure reset link
                                  </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Click the link to set a new password
                      </li>
                    </ul>
                  </div>
                </StaggerItem>

                <StaggerItem className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-12 h-12 text-base transition-all duration-300 rounded-xl border-2 ${
                        (showValidationErrors || formik.touched.email) && formik.errors.email 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : formik.touched.email && !formik.errors.email
                          ? 'border-green-300 focus:border-green-500 bg-green-50'
                          : 'border-gray-200 focus:border-blue-500 focus:bg-white'
                      }`}
                    />
                  </div>
                  {(showValidationErrors || formik.touched.email) && formik.errors.email && (
                    <FadeIn className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                      <span className="text-red-500">⚠️</span>
                      {formik.errors.email}
                    </FadeIn>
                  )}
                  {formik.touched.email && !formik.errors.email && (
                    <FadeIn className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                      <span className="text-green-500">✅</span>
                      Email looks good!
                    </FadeIn>
                  )}
                </StaggerItem>

                <StaggerItem className="pt-4">
                  <HoverLift>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <div className="flex items-center space-x-3">
                          <Pulse>
                            <div className="w-5 h-5 bg-white rounded-full"></div>
                          </Pulse>
                          <span>Sending Reset Link...</span>
                        </div>
                      ) : (
                        'Send Reset Link'
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

export default ForgotPassword
