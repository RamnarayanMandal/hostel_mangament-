"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Building2, 
  Calendar, 
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { 
  StaggerContainer, 
  StaggerItem, 
  FadeIn, 
  SlideUp, 
  HoverLift
} from '@/components/ui/motion'

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      description: "Active students in hostels"
    },
    {
      title: "Total Hostels",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Building2,
      description: "Managed hostels"
    },
    {
      title: "Active Bookings",
      value: "456",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      description: "Current bookings"
    },
    {
      title: "Revenue",
      value: "₹2.4M",
      change: "+15%",
      trend: "up",
      icon: CreditCard,
      description: "This month's revenue"
    }
  ]

  return (
    <div className="space-y-6">
      <SlideUp>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your hostels.</p>
        </div>
      </SlideUp>

      {/* Stats Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <HoverLift>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="flex items-center space-x-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">from last month</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Recent Activity */}
      <StaggerContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaggerItem>
            <FadeIn>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest hostel bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New booking from Student {item}</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>

          <StaggerItem>
            <FadeIn>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common admin tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <HoverLift>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Add New Student</p>
                            <p className="text-sm text-gray-500">Register a new student</p>
                          </div>
                        </div>
                      </button>
                    </HoverLift>
                    <HoverLift>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Manage Hostels</p>
                            <p className="text-sm text-gray-500">View and edit hostel details</p>
                          </div>
                        </div>
                      </button>
                    </HoverLift>
                    <HoverLift>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">View Bookings</p>
                            <p className="text-sm text-gray-500">Check all bookings</p>
                          </div>
                        </div>
                      </button>
                    </HoverLift>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </div>
  )
}
