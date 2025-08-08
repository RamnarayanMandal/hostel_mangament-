"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-pink-100 mb-6">
            <div className="text-4xl font-bold text-red-500">404</div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>
              The page you requested might have been moved, deleted, or you entered the wrong URL.
            </p>
            <p>
              Don&apos;t worry, we&apos;ll help you get back on track!
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
            
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 font-medium py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => router.push('/hostels')}
                variant="ghost"
                className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Hostels
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-center text-xs text-gray-400">
              <p>Need help? Contact our support team</p>
              <p className="mt-1">
                <a 
                  href="mailto:support@hostelmanagement.com" 
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  support@hostelmanagement.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 