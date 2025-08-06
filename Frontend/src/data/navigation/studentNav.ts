import { 
  Home, 
  Building2, 
  Calendar, 
  FileText, 
  Settings, 
  User,
  CreditCard,
  MessageSquare,
  Bell,
  BookOpen,
  MapPin,
  HelpCircle,
  Star,
  Clock
} from 'lucide-react'
import { NavItemType } from '@/components/ui/nav-item'

export const studentNavigation: NavItemType[] = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: Home
  },
  {
    title: "My Hostel",
    href: "/student/hostel",
    icon: Building2
  },
  {
    title: "My Room",
    href: "/student/room",
    icon: MapPin
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: User
  },
  {
    title: "Bookings",
    href: "/student/bookings",
    icon: Calendar
  },
  {
    title: "Payments",
    href: "/student/payments",
    icon: CreditCard
  },
  {
    title: "Documents",
    href: "/student/documents",
    icon: FileText
  },
  {
    title: "Study Schedule",
    href: "/student/schedule",
    icon: Clock
  },
  {
    title: "Courses",
    href: "/student/courses",
    icon: BookOpen
  },
  {
    title: "Messages",
    href: "/student/messages",
    icon: MessageSquare
  },
  {
    title: "Notifications",
    href: "/student/notifications",
    icon: Bell
  },
  {
    title: "Reviews",
    href: "/student/reviews",
    icon: Star
  },
  {
    title: "Settings",
    href: "/student/settings",
    icon: Settings
  },
  {
    title: "Help & Support",
    href: "/student/help",
    icon: HelpCircle
  }
] 