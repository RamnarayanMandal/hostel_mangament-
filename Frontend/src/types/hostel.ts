// Hostel Types
export interface Hostel {
  _id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phoneNumber: string
  email: string
  capacity: number
  occupied: number
  available: number
  description?: string
  amenities: string[]
  images: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  createdAt: string
  updatedAt: string
}

export interface Room {
  _id: string
  hostelId: string
  roomNumber: string
  floor: number
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD'
  capacity: number
  occupied: number
  available: number
  price: number
  amenities: string[]
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED'
  createdAt: string
  updatedAt: string
}

export interface Booking {
  _id: string
  userId: string
  hostelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  createdAt: string
  updatedAt: string
}

export interface Payment {
  _id: string
  bookingId: string
  userId: string
  amount: number
  currency: string
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'ONLINE'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  transactionId?: string
  paymentDate: string
  createdAt: string
  updatedAt: string
}

export interface Maintenance {
  _id: string
  hostelId: string
  roomId?: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  assignedTo?: string
  reportedBy: string
  reportedDate: string
  completedDate?: string
  createdAt: string
  updatedAt: string
}

export interface Complaint {
  _id: string
  userId: string
  hostelId: string
  roomId?: string
  subject: string
  description: string
  category: 'GENERAL' | 'MAINTENANCE' | 'SECURITY' | 'FOOD' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface Notice {
  _id: string
  hostelId: string
  title: string
  content: string
  type: 'GENERAL' | 'IMPORTANT' | 'URGENT' | 'MAINTENANCE'
  targetAudience: 'ALL' | 'STUDENTS' | 'STAFF' | 'ADMIN'
  startDate: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Request/Response Types
export interface CreateHostelRequest {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phoneNumber: string
  email: string
  capacity: number
  description?: string
  amenities: string[]
}

export interface UpdateHostelRequest {
  name?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  email?: string
  capacity?: number
  description?: string
  amenities?: string[]
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
}

export interface CreateRoomRequest {
  hostelId: string
  roomNumber: string
  floor: number
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD'
  capacity: number
  price: number
  amenities: string[]
}

export interface CreateBookingRequest {
  hostelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
}

export interface CreateComplaintRequest {
  hostelId: string
  roomId?: string
  subject: string
  description: string
  category: 'GENERAL' | 'MAINTENANCE' | 'SECURITY' | 'FOOD' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export interface CreateMaintenanceRequest {
  hostelId: string
  roomId?: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export interface CreateNoticeRequest {
  hostelId: string
  title: string
  content: string
  type: 'GENERAL' | 'IMPORTANT' | 'URGENT' | 'MAINTENANCE'
  targetAudience: 'ALL' | 'STUDENTS' | 'STAFF' | 'ADMIN'
  startDate: string
  endDate?: string
} 