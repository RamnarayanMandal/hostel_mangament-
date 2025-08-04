import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/authMiddleware';
import { PERMISSION, USER_ROLE } from '../../types/enum';

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Hotel Management Routes
// ======================

// View hotels (available to all authenticated users)
router.get('/hotels', 
  AuthMiddleware.requirePermission([PERMISSION.VIEW_HOTELS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Hotels retrieved successfully',
      data: {
        hotels: [
          { id: 1, name: 'Grand Hotel', location: 'Downtown', rating: 4.5 },
          { id: 2, name: 'Seaside Resort', location: 'Beach', rating: 4.8 },
        ]
      }
    });
  }
);

// Manage hotels (admin only)
router.post('/hotels', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_HOTELS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Hotel created successfully',
      data: { hotelId: 'new-hotel-id' }
    });
  }
);

// Room Management Routes
// =====================

// View rooms (staff and above)
router.get('/rooms', 
  AuthMiddleware.requirePermission([PERMISSION.VIEW_ROOMS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Rooms retrieved successfully',
      data: {
        rooms: [
          { id: 1, number: '101', type: 'Standard', price: 100 },
          { id: 2, number: '102', type: 'Deluxe', price: 200 },
        ]
      }
    });
  }
);

// Manage rooms (manager and above)
router.post('/rooms', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_ROOMS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Room created successfully',
      data: { roomId: 'new-room-id' }
    });
  }
);

// Booking Management Routes
// ========================

// View bookings (staff and above)
router.get('/bookings', 
  AuthMiddleware.requirePermission([PERMISSION.VIEW_BOOKINGS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: [
          { id: 1, guestName: 'John Doe', roomNumber: '101', checkIn: '2024-01-15' },
          { id: 2, guestName: 'Jane Smith', roomNumber: '102', checkIn: '2024-01-16' },
        ]
      }
    });
  }
);

// Create booking (user and above)
router.post('/bookings', 
  AuthMiddleware.requirePermission([PERMISSION.CREATE_BOOKING]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Booking created successfully',
      data: { bookingId: 'new-booking-id' }
    });
  }
);

// Manage bookings (manager and above)
router.put('/bookings/:id', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_BOOKINGS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { bookingId: req.params.id }
    });
  }
);

// Payment Management Routes
// ========================

// View payments (staff and above)
router.get('/payments', 
  AuthMiddleware.requirePermission([PERMISSION.VIEW_PAYMENTS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Payments retrieved successfully',
      data: {
        payments: [
          { id: 1, amount: 100, status: 'paid', method: 'credit_card' },
          { id: 2, amount: 200, status: 'pending', method: 'cash' },
        ]
      }
    });
  }
);

// Manage payments (admin only)
router.post('/payments', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_PAYMENTS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: { paymentId: 'new-payment-id' }
    });
  }
);

// Reports and Analytics Routes
// ===========================

// View reports (manager and above)
router.get('/reports', 
  AuthMiddleware.requirePermission([PERMISSION.VIEW_REPORTS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Reports retrieved successfully',
      data: {
        reports: [
          { id: 1, type: 'occupancy', data: { occupancyRate: 85 } },
          { id: 2, type: 'revenue', data: { totalRevenue: 50000 } },
        ]
      }
    });
  }
);

// Export data (admin only)
router.get('/export', 
  AuthMiddleware.requirePermission([PERMISSION.EXPORT_DATA]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Data export initiated',
      data: { exportId: 'export-123', format: 'csv' }
    });
  }
);

// System Settings Routes
// ======================

// Manage settings (admin only)
router.get('/settings', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_SETTINGS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Settings retrieved successfully',
      data: {
        settings: {
          hotelName: 'Grand Hotel',
          checkInTime: '15:00',
          checkOutTime: '11:00',
          currency: 'USD'
        }
      }
    });
  }
);

// View logs (super admin only)
router.get('/logs', 
  AuthMiddleware.requirePermission([PERMISSION.VIEW_LOGS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'System logs retrieved successfully',
      data: {
        logs: [
          { id: 1, level: 'info', message: 'User login successful', timestamp: '2024-01-15T10:00:00Z' },
          { id: 2, level: 'error', message: 'Payment failed', timestamp: '2024-01-15T09:30:00Z' },
        ]
      }
    });
  }
);

// Role-based demonstration routes
// ==============================

// Admin only route
router.get('/admin-only', 
  AuthMiddleware.requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin access granted',
      data: { secret: 'admin-secret-data' }
    });
  }
);

// Teacher and above route
router.get('/teacher-plus', 
  AuthMiddleware.requireTeacher,
  (req, res) => {
    res.json({
      success: true,
      message: 'Teacher+ access granted',
      data: { teacherData: 'teacher-and-above-data' }
    });
  }
);

// Student and above route
router.get('/student-plus', 
  AuthMiddleware.requireStudent,
  (req, res) => {
    res.json({
      success: true,
      message: 'Student+ access granted',
      data: { studentData: 'student-and-above-data' }
    });
  }
);

// Multiple permission check
router.get('/multi-permission', 
  AuthMiddleware.requirePermission([PERMISSION.VIEW_HOTELS, PERMISSION.VIEW_ROOMS]),
  (req, res) => {
    res.json({
      success: true,
      message: 'Multi-permission access granted',
      data: { 
        hotels: [{ id: 1, name: 'Hotel A' }],
        rooms: [{ id: 1, number: '101' }]
      }
    });
  }
);

// Current user info route
router.get('/me', (req, res) => {
  res.json({
    success: true,
    message: 'Current user information',
    data: {
      userId: req.user?.userId,
      email: req.user?.email,
      role: req.user?.role,
      permissions: 'Check /api/role/permissions/current for detailed permissions'
    }
  });
});

export default router; 