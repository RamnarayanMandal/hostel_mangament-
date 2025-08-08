import axios from 'axios'

// Create axios instance
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      // Create a custom error object with the server message
      const customError = new Error(data?.message || 'Something went wrong') as Error & {
        response: any
        status: number
      }
      customError.response = error.response
      customError.status = status
      
      switch (status) {
        case 401:
          // Unauthorized - don't auto-redirect, let the component handle it
          // This allows for email verification flow to work properly
          console.error('Unauthorized access')
          break
        case 403:
          // Forbidden
          console.error('Access forbidden')
          break
        case 404:
          // Not found
          console.error('Resource not found')
          break
        case 500:
          // Server error
          console.error('Server error')
          break
        default:
          console.error('API Error:', data?.message || 'Something went wrong')
      }
      
      return Promise.reject(customError)
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received')
      const networkError = new Error('Network error - no response received')
      return Promise.reject(networkError)
    } else {
      // Something else happened
      console.error('Request error:', error.message)
      return Promise.reject(error)
    }
  }
)

export default axiosClient
