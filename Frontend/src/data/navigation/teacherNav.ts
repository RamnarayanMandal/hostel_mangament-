import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings, 
  User,
  MessageSquare,
  Bell,
  BarChart3,
  GraduationCap,
  Clock,
  HelpCircle,
  Award,
  ClipboardList
} from 'lucide-react'
import { NavItemType } from '@/components/ui/nav-item'

export const teacherNavigation: NavItemType[] = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: Home
  },
  {
    title: "My Students",
    href: "/teacher/students",
    icon: Users
  },
  {
    title: "My Courses",
    href: "/teacher/courses",
    icon: BookOpen
  },
  {
    title: "Profile",
    href: "/teacher/profile",
    icon: User
  },
  {
    title: "Schedule",
    href: "/teacher/schedule",
    icon: Calendar
  },
  {
    title: "Assignments",
    href: "/teacher/assignments",
    icon: ClipboardList
  },
  {
    title: "Grades",
    href: "/teacher/grades",
    icon: Award
  },
  {
    title: "Attendance",
    href: "/teacher/attendance",
    icon: Clock
  },
  {
    title: "Reports",
    href: "/teacher/reports",
    icon: BarChart3
  },
  {
    title: "Documents",
    href: "/teacher/documents",
    icon: FileText
  },
  {
    title: "Course Materials",
    href: "/teacher/materials",
    icon: GraduationCap
  },
  {
    title: "Messages",
    href: "/teacher/messages",
    icon: MessageSquare
  },
  {
    title: "Notifications",
    href: "/teacher/notifications",
    icon: Bell
  },
  {
    title: "Settings",
    href: "/teacher/settings",
    icon: Settings
  },
  {
    title: "Help & Support",
    href: "/teacher/help",
    icon: HelpCircle
  }
] 