"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

const BreadcrumbItem = ({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) => {
  const content = (
    <div className="flex items-center gap-2">
      {item.icon && <item.icon className="h-4 w-4" />}
      <span>{item.label}</span>
    </div>
  )

  if (isLast || !item.href) {
    return (
      <motion.span
        className={cn(
          "text-sm font-medium",
          isLast ? "text-foreground" : "text-muted-foreground"
        )}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={item.href}
        className={cn(
          "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        )}
      >
        {content}
      </Link>
    </motion.div>
  )
}

const Separator = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
  >
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </motion.div>
)

export function Breadcrumb({ items = [], className, showHome = true }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs from pathname if no items provided
  const breadcrumbItems = React.useMemo(() => {
    if (items.length > 0) {
      return items
    }

    const pathSegments = pathname.split('/').filter(Boolean)
    const generatedItems: BreadcrumbItem[] = []

    if (showHome) {
      generatedItems.push({
        label: 'Home',
        href: '/',
        icon: Home
      })
    }

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      generatedItems.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath
      })
    })

    return generatedItems
  }, [pathname, items, showHome])

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <motion.nav
      className={cn("flex items-center space-x-1 text-sm", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem item={item} isLast={index === breadcrumbItems.length - 1} />
          {index < breadcrumbItems.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </motion.nav>
  )
}

// Convenience component for simple breadcrumbs
export function SimpleBreadcrumb({ 
  title, 
  parentTitle, 
  parentHref,
  className 
}: {
  title: string
  parentTitle?: string
  parentHref?: string
  className?: string
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: Home }
  ]

  if (parentTitle && parentHref) {
    items.push({ label: parentTitle, href: parentHref })
  }

  items.push({ label: title })

  return <Breadcrumb items={items} className={className} showHome={false} />
} 