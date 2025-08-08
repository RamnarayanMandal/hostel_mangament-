// Common Types
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  statusCode?:number
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ErrorResponse {
  success: false
  message: string
  error: string
  statusCode?: number
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'select' | 'checkbox' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

// UI Types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
  isActive?: boolean
}

// Table Types
export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

// Filter Types
export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterConfig {
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'gt' | 'lt' | 'gte' | 'lte'
  value: string | number | string[] | number[]
} 