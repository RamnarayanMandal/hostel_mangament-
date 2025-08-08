"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award,
  Clock,
  GraduationCap,
  BarChart3
} from 'lucide-react'
import { 
  StaggerContainer, 
  StaggerItem, 
  FadeIn, 
  SlideUp, 
  HoverLift
} from '@/components/ui/motion'

export default function TeacherDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "156",
      icon: Users,
      description: "Under my guidance"
    },
    {
      title: "Active Courses",
      value: "8",
      icon: BookOpen,
      description: "This semester"
    },
    {
      title: "Classes Today",
      value: "5",
      icon: Calendar,
      description: "Scheduled classes"
    },
    {
      title: "Average Grade",
      value: "85%",
      icon: Award,
      description: "Class performance"
    }
  ]

  const upcomingClasses = [
    {
      subject: "Computer Science",
      time: "09:00 AM",
      room: "Lab 101",
      students: 25
    },
    {
      subject: "Mathematics",
      time: "11:00 AM",
      room: "Room 205",
      students: 30
    },
    {
      subject: "Physics",
      time: "02:00 PM",
      room: "Lab 203",
      students: 28
    }
  ]

  return (
    <div className="space-y-6">
      <SlideUp>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your teaching overview.</p>
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
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Content Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaggerItem>
            <FadeIn>
              <Card>
                <CardHeader>
                  <CardTitle>Today&apos;s Classes</CardTitle>
                  <CardDescription>Your scheduled classes for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingClasses.map((classItem, index) => (
                      <HoverLift key={index}>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{classItem.subject}</p>
                              <p className="text-sm text-gray-500">{classItem.room}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{classItem.time}</p>
                            <p className="text-sm text-gray-500">{classItem.students} students</p>
                          </div>
                        </div>
                      </HoverLift>
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
                  <CardDescription>Common teaching tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <HoverLift>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Grade Assignments</p>
                            <p className="text-sm text-gray-500">Review student work</p>
                          </div>
                        </div>
                      </button>
                    </HoverLift>
                    <HoverLift>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Take Attendance</p>
                            <p className="text-sm text-gray-500">Mark student presence</p>
                          </div>
                        </div>
                      </button>
                    </HoverLift>
                    <HoverLift>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Upload Materials</p>
                            <p className="text-sm text-gray-500">Share course content</p>
                          </div>
                        </div>
                      </button>
                    </HoverLift>
                    <HoverLift>
                      <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-medium">View Reports</p>
                            <p className="text-sm text-gray-500">Student performance</p>
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

      {/* Recent Activity */}
      <StaggerItem>
        <FadeIn>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Graded 25 assignments</p>
                    <p className="text-xs text-gray-500">Computer Science Project</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Attendance marked</p>
                    <p className="text-xs text-gray-500">Physics Class - 28/30 present</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Course material uploaded</p>
                    <p className="text-xs text-gray-500">Mathematics Lecture Notes</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </StaggerItem>
    </div>
  )
} 