"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {  ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface NavItemType {
  title: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  items?: NavItemType[]
  disabled?: boolean
  external?: boolean
}

export interface NavGroupType {
  title: string
  items: NavItemType[]
}

interface NavItemProps {
  item: NavItemType
  isActive?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  level?: number
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ item, isActive, isExpanded, onToggle, level = 0 }, ref) => {
    const hasItems = item.items && item.items.length > 0
    const isLink = item.href && !hasItems

    const content = (
      <div className="flex items-center gap-2">
        {item.icon && <item.icon className="h-4 w-4" />}
        <span>{item.title}</span>
        {hasItems && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-3 w-3" />
          </motion.div>
        )}
      </div>
    )

    if (isLink) {
      return (
        <motion.a
          ref={ref}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground",
            item.disabled && "pointer-events-none opacity-60",
            level > 0 && "ml-4"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content}
        </motion.a>
      )
    }

    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isActive && "bg-accent",
            level > 0 && "ml-4"
          )}
          onClick={onToggle}
          disabled={item.disabled}
        >
          {content}
        </Button>
        {hasItems && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-1">
                  {item.items!.map((subItem, index) => (
                    <NavItem
                      key={index}
                      item={subItem}
                      level={level + 1}
                      isActive={isActive}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }
)
NavItem.displayName = "NavItem"

interface NavGroupProps {
  group: NavGroupType
}

const NavGroup = React.forwardRef<HTMLDivElement, NavGroupProps>(
  ({ group }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="space-y-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="px-3 py-1 text-sm font-semibold text-muted-foreground">
          {group.title}
        </h3>
        <div className="space-y-1">
          {group.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavItem item={item} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }
)
NavGroup.displayName = "NavGroup"

interface NavItemsProps {
  items: NavItemType[]
}

const NavItems = React.forwardRef<HTMLDivElement, NavItemsProps>(
  ({ items }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavItem item={item} />
          </motion.div>
        ))}
      </motion.div>
    )
  }
)
NavItems.displayName = "NavItems"

interface NavGroupsProps {
  groups: NavGroupType[]
}

const NavGroups = React.forwardRef<HTMLDivElement, NavGroupsProps>(
  ({ groups }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {groups.map((group, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavGroup group={group} />
          </motion.div>
        ))}
      </motion.div>
    )
  }
)
NavGroups.displayName = "NavGroups"

interface NavigationProps {
  navigation: NavItemType[] | NavGroupType[]
  className?: string
}

const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ navigation, className }, ref) => {
    const isGroups = navigation.length > 0 && 'items' in navigation[0]

    return (
      <motion.nav
        ref={ref}
        className={cn("space-y-2", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isGroups ? (
          <NavGroups groups={navigation as NavGroupType[]} />
        ) : (
          <NavItems items={navigation as NavItemType[]} />
        )}
      </motion.nav>
    )
  }
)
Navigation.displayName = "Navigation"

export { NavItem, NavGroup, NavItems, NavGroups, Navigation } 