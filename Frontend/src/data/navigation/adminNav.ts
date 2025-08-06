import { 
  Building2, 
  Users, 
  Home, 
  Settings, 
  User,
  FileText,
  Calendar,
  BarChart3,
  Shield,
  Bell,
  Search,
  CreditCard,
  MessageSquare,
  HelpCircle
} from 'lucide-react'
import { NavItemType } from '@/components/ui/nav-item'

export const adminNavigation: NavItemType[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home
  },
  {
    title: "Hostels",
    href: "/admin/hostels",
    icon: Building2
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users
  },
  {
    title: "Teachers",
    href: "/admin/teachers",
    icon: User
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  },
  {
    title: "Help & Support",
    href: "/admin/help",
    icon: HelpCircle
  }
] 