"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Menu} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <motion.div
      className={cn("pb-12", className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarHeader({ className, children, ...props }: SidebarHeaderProps) {
  return (
    <motion.div
      className={cn("flex h-14 items-center border-b px-4", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarContent({ className, children, ...props }: SidebarContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <ScrollArea className={cn("h-[calc(90vh-3.5rem)]", className)}>
        {children}
      </ScrollArea>
    </motion.div>
  )
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarFooter({ className, children, ...props }: SidebarFooterProps) {
  return (
    <div className={cn("flex h-14 items-center border-t px-4", className)} {...props}>
      {children}
    </div>
  )
}

interface SidebarMobileProps {
  children: React.ReactNode
  trigger?: React.ReactNode
}

export function SidebarMobile({ children, trigger }: SidebarMobileProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SidebarHeader>
          <div className="flex items-center space-x-2 py-4">
            <Building2 className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">HostelHub</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {children}
        </SidebarContent>
      </SheetContent>
    </Sheet>
  )
} 