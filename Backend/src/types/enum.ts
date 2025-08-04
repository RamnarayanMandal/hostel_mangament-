export enum USER_ROLE {
    STUDENT = 'student',
    TEACHER = 'teacher',
    ADMIN = 'admin',
}

export enum USER_STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum USER_GENDER {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export enum APPLICATION_STATUS {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum PAYMENT_STATUS {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export enum CATEGORY {
    GENERAL = 'general',
    OBC = 'obc',
    SC = 'sc',
    ST = 'st',
    EWS = 'ews',

}

// Permission enums for role-based access control
export enum PERMISSION {
    // User management
    CREATE_USER = 'create_user',
    READ_USER = 'read_user',
    UPDATE_USER = 'update_user',
    DELETE_USER = 'delete_user',
    
    // Role management
    MANAGE_ROLES = 'manage_roles',
    ASSIGN_ROLES = 'assign_roles',
    
    // Hotel management
    MANAGE_HOTELS = 'manage_hotels',
    VIEW_HOTELS = 'view_hotels',
    
    // Booking management
    MANAGE_BOOKINGS = 'manage_bookings',
    VIEW_BOOKINGS = 'view_bookings',
    CREATE_BOOKING = 'create_booking',
    
    // Room management
    MANAGE_ROOMS = 'manage_rooms',
    VIEW_ROOMS = 'view_rooms',
    
    // Payment management
    MANAGE_PAYMENTS = 'manage_payments',
    VIEW_PAYMENTS = 'view_payments',
    
    // Reports and analytics
    VIEW_REPORTS = 'view_reports',
    EXPORT_DATA = 'export_data',
    
    // System settings
    MANAGE_SETTINGS = 'manage_settings',
    VIEW_LOGS = 'view_logs',
}

// Role hierarchy - defines which roles can manage which other roles
export const ROLE_HIERARCHY: Record<USER_ROLE, USER_ROLE[]> = {
    [USER_ROLE.ADMIN]: [USER_ROLE.TEACHER, USER_ROLE.STUDENT],
    [USER_ROLE.TEACHER]: [USER_ROLE.STUDENT],
    [USER_ROLE.STUDENT]: [],
};

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<USER_ROLE, PERMISSION[]> = {
    [USER_ROLE.ADMIN]: [
        PERMISSION.CREATE_USER, PERMISSION.READ_USER, PERMISSION.UPDATE_USER, PERMISSION.DELETE_USER,
        PERMISSION.MANAGE_ROLES, PERMISSION.ASSIGN_ROLES,
        PERMISSION.MANAGE_HOTELS, PERMISSION.VIEW_HOTELS,
        PERMISSION.MANAGE_BOOKINGS, PERMISSION.VIEW_BOOKINGS, PERMISSION.CREATE_BOOKING,
        PERMISSION.MANAGE_ROOMS, PERMISSION.VIEW_ROOMS,
        PERMISSION.MANAGE_PAYMENTS, PERMISSION.VIEW_PAYMENTS,
        PERMISSION.VIEW_REPORTS, PERMISSION.EXPORT_DATA,
        PERMISSION.MANAGE_SETTINGS, PERMISSION.VIEW_LOGS,
    ],
    [USER_ROLE.TEACHER]: [
        PERMISSION.READ_USER,
        PERMISSION.VIEW_HOTELS,
        PERMISSION.MANAGE_BOOKINGS, PERMISSION.VIEW_BOOKINGS, PERMISSION.CREATE_BOOKING,
        PERMISSION.MANAGE_ROOMS, PERMISSION.VIEW_ROOMS,
        PERMISSION.VIEW_PAYMENTS,
        PERMISSION.VIEW_REPORTS,
    ],
    [USER_ROLE.STUDENT]: [
        PERMISSION.VIEW_HOTELS,
        PERMISSION.VIEW_BOOKINGS, PERMISSION.CREATE_BOOKING,
        PERMISSION.VIEW_ROOMS,
        PERMISSION.VIEW_PAYMENTS,
    ],
};
