import { useMutation, useQuery } from '@tanstack/react-query'
import authService from '@/service/authService'
import {
  AuthResponse,
} from '@/types'

// Define error type
type ApiError = {
  message: string
  response?: {
    data?: {
      message?: string
    }
  }
}

// Custom hooks
export const useSignup = () => {
  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data: AuthResponse) => {
      console.log('Signup successful:', data)
      // Store token if provided
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      // You can add success handling here (redirect, show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Signup error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: AuthResponse) => {
      console.log('Login successful:', data)
      // Store token if provided
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      // You can add success handling here (redirect, store token, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Login error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear token and redirect
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    },
    onError: (error: ApiError) => {
      console.error('Logout error:', error)
      // Even if logout fails, clear token locally
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
  })
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('token'), // Only run if token exists
  })
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      console.log('Profile updated successfully:', data)
      // You can add success handling here (show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Profile update error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data: AuthResponse) => {
      console.log('Password changed successfully:', data)
      // You can add success handling here (show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Password change error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      console.log('Forgot password email sent:', data)
      // You can add success handling here (show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Forgot password error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data: AuthResponse) => {
      console.log('Password reset successfully:', data)
      // You can add success handling here (redirect to login, show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Password reset error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useVerifyEmailOTP = () => {
  return useMutation({
    mutationFn: authService.verifyEmailOTP,
    onSuccess: (data: AuthResponse) => {
      console.log('Email OTP verified successfully:', data)
      // You can add success handling here (redirect, show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Email OTP verification error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useVerifyPhoneOTP = () => {
  return useMutation({
    mutationFn: authService.verifyPhoneOTP,
    onSuccess: (data: AuthResponse) => {
      console.log('Phone OTP verified successfully:', data)
      // You can add success handling here (redirect, show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Phone OTP verification error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useResendEmailOTP = () => {
  return useMutation({
    mutationFn: authService.resendEmailOTP,
    onSuccess: (data) => {
      console.log('Email OTP resent successfully:', data)
      // You can add success handling here (show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Resend email OTP error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useResendPhoneOTP = () => {
  return useMutation({
    mutationFn: authService.resendPhoneOTP,
    onSuccess: (data) => {
      console.log('Phone OTP resent successfully:', data)
      // You can add success handling here (show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Resend phone OTP error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
}

export const useFirebaseAuth = () => {
  return useMutation({
    mutationFn: authService.firebaseAuth,
    onSuccess: (data: AuthResponse) => {
      console.log('Firebase auth successful:', data)
      // Store token if provided
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token)
        // Store user data if needed
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user))
        }
      } else if (data.token) {
        // Fallback for old response format
        localStorage.setItem('token', data.token)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      }
      // You can add success handling here (redirect, show toast, etc.)
    },
    onError: (error: ApiError) => {
      console.error('Firebase auth error:', error)
      // You can add error handling here (show toast, etc.)
    }
  })
} 