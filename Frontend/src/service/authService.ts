
import axiosClient from '@/lib/axiosClient'
import {
  SignupData,
  LoginData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
  OTPVerificationData,
  ResendOTPData,
  AuthResponse,
  UserData,
  GoogleAuthResponse,
  OTPResponse,
  ProfileResponse
} from '@/types'

// Auth Service
export const authService = {
  // Signup
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/signup', userData)
    return response.data
  },

  // Login
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  // Logout
  logout: async (): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/logout')
    return response.data
  },

  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosClient.get<ProfileResponse>('/auth/profile')
    return response.data
  },

  // Update profile
  updateProfile: async (profileData: UpdateProfileData): Promise<ProfileResponse> => {
    const response = await axiosClient.put<ProfileResponse>('/auth/profile', profileData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData): Promise<AuthResponse> => {
    const response = await axiosClient.put<AuthResponse>('/auth/change-password', passwordData)
    return response.data
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<OTPResponse> => {
    const response = await axiosClient.post<OTPResponse>('/auth/forgot-password', data)
    return response.data
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/reset-password', data)
    return response.data
  },

  // Verify email OTP
  verifyEmailOTP: async (data: OTPVerificationData): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/verify-email-otp', data)
    return response.data
  },

  // Verify phone OTP
  verifyPhoneOTP: async (data: OTPVerificationData): Promise<AuthResponse> => {
      const otp = data.otp.toString()
      const email = data.email
      const phone = data.phoneNumber
    
      const emailVerificationData =
      {
        otp,
        email,
        phoneNumber:phone
      }
     
      
    const response = await axiosClient.post<AuthResponse>('/auth/verify-phone-otp', emailVerificationData)
    return response.data
  },

  // Resend email OTP
  resendEmailOTP: async (data: ResendOTPData): Promise<OTPResponse> => {
    const response = await axiosClient.post<OTPResponse>('/auth/resend-email-otp', data)
    return response.data
  },

  // Resend phone OTP
  resendPhoneOTP: async (data: ResendOTPData): Promise<OTPResponse> => {
    const response = await axiosClient.post<OTPResponse>('/auth/resend-phone-otp', data)
    return response.data
  },

  // Firebase Authentication
  firebaseAuth: async (idToken: string): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/firebase/signup', { idToken })
    return response.data
  },

  firebaseLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/firebase/login', { idToken })
    return response.data
  }
}

export default authService
