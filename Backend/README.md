# Hotel Management System - Authentication API

A comprehensive authentication system for the Hotel Management System with email/password authentication, OTP verification, Google OAuth, and Zod validation.

## Features

- ✅ **User Registration & Login** with email/password
- ✅ **Email Verification** with OTP
- ✅ **Phone Verification** with OTP
- ✅ **Google OAuth Login** integration
- ✅ **Password Reset** functionality
- ✅ **JWT Authentication** with middleware
- ✅ **Zod Validation** for all inputs
- ✅ **Rate Limiting** for security
- ✅ **Account Locking** after failed attempts
- ✅ **Profile Management**
- ✅ **Dynamic Role-based Authentication System**
  - 3 Core Roles: Student, Teacher, Admin
  - Dynamic Role Management (Create, Update, Delete Custom Roles)
  - 20+ Granular Permissions
  - Role Hierarchy Enforcement
  - Permission-based Access Control
  - Role Assignment & Management
  - System Role Protection
  - Role Analytics & Statistics

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod
- **Email**: Nodemailer
- **OAuth**: Google OAuth 2.0
- **SMS**: Mock service (configurable for Twilio/AWS SNS)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Google Cloud Console account (for OAuth)
- SMTP email service (Gmail, SendGrid, etc.)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hotel_Management/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .envSample .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/hotel_management
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-32-characters-long
   JWT_EXPIRES_IN=7d
   
   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes

#### 1. User Registration
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "phoneNumber": "9876543210",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email and phone number.",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0"
  }
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isEmailVerified": true,
      "isPhoneVerified": true
    }
  }
}
```

#### 3. Email OTP Verification
```http
POST /api/auth/verify-email-otp
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

#### 4. Phone OTP Verification
```http
POST /api/auth/verify-phone-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```

#### 5. Resend Email OTP
```http
POST /api/auth/resend-email-otp
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```

#### 6. Resend Phone OTP
```http
POST /api/auth/resend-phone-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

#### 7. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```

#### 8. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

### Google OAuth Routes

#### 9. Get Google Auth URL
```http
GET /api/auth/google/auth-url
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

#### 10. Google OAuth Login
```http
POST /api/auth/google/login
Content-Type: application/json

{
  "code": "authorization-code-from-google"
}
```

### Protected Routes (Require Authentication)

#### 11. Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

#### 12. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "9876543210",
  "address": "456 Oak St",
  "city": "Delhi"
}
```

#### 13. Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "currentPassword": "OldSecurePass123!",
  "newPassword": "NewSecurePass123!",
  "confirmNewPassword": "NewSecurePass123!"
}
```

#### 14. Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt-token>
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Email Requirements
- Valid email format
- Automatically converted to lowercase

### Phone Number Requirements
- 10 digits starting with 6-9 (Indian format)
- Format: `9876543210`

### Name Requirements
- 2-50 characters
- Only letters and spaces allowed

## Security Features

- **Rate Limiting**: Prevents brute force attacks
- **Account Locking**: Locks account after 5 failed login attempts
- **JWT Expiration**: Tokens expire after 7 days
- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configurable CORS settings

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | `7d` |
| `SMTP_HOST` | SMTP server host | No | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | No | `587` |
| `SMTP_USER` | SMTP username | Yes | - |
| `SMTP_PASS` | SMTP password | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes | - |
| `GOOGLE_REDIRECT_URI` | Google OAuth redirect URI | Yes | - |
| `FRONTEND_URL` | Frontend application URL | No | `http://localhost:3000` |
| `CORS_ORIGIN` | CORS allowed origin | No | `http://localhost:3000` |

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy Client ID and Client Secret to your `.env` file

## SMS Service Setup

The SMS service is currently a mock implementation. For production:

### Twilio Setup
1. Sign up for Twilio
2. Get Account SID and Auth Token
3. Add to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-number
   ```

### AWS SNS Setup
1. Create AWS account
2. Create IAM user with SNS permissions
3. Add to `.env`:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   ```

## Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Project Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── utils/          # Utility functions
└── validations/    # Zod validation schemas
```

## Dynamic Role-Based Authentication System

The system implements a comprehensive dynamic role-based authentication system with 3 core roles and support for custom roles.

### Core Roles (System Roles)

The system includes three predefined roles that cannot be deleted or modified:

1. **STUDENT** - Basic user with limited permissions
2. **TEACHER** - Intermediate user with administrative capabilities  
3. **ADMIN** - Full system administrator with all permissions

### Role Hierarchy

```
ADMIN
├── TEACHER
│   └── STUDENT
└── STUDENT
```

- **ADMIN** can manage TEACHER and STUDENT roles
- **TEACHER** can manage STUDENT roles
- **STUDENT** cannot manage any roles

### Key Features

- **Dynamic Role Management**: Create, update, and delete custom roles
- **20+ Granular Permissions**: User management, hotel management, booking management, etc.
- **Role Hierarchy Enforcement**: Users can only manage roles below their level
- **Permission-based Access Control**: Fine-grained access control for each operation
- **System Role Protection**: Core roles cannot be modified or deleted
- **Role Assignment & Management**: Assign roles to users with proper validation
- **Role Analytics & Statistics**: View role distribution and statistics

### Role Management Endpoints

#### Initialize System Roles
```http
POST /api/role/initialize
Authorization: Bearer <token>
```

#### Create Custom Role
```http
POST /api/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "moderator",
  "displayName": "Moderator",
  "description": "Can manage bookings and view reports",
  "permissions": ["view_hotels", "manage_bookings", "view_bookings", "view_rooms", "view_payments", "view_reports"]
}
```

#### Assign Role to User
```http
POST /api/role/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here",
  "roleName": "teacher"
}
```

#### Get Role Permissions
```http
GET /api/role/permissions/:roleName
Authorization: Bearer <token>
```

#### Check User Permission
```http
GET /api/role/check-permission/:permission
Authorization: Bearer <token>
```

### Permission Matrix

| Permission | ADMIN | TEACHER | STUDENT |
|------------|-------|---------|---------|
| create_user | ✅ | ❌ | ❌ |
| read_user | ✅ | ✅ | ❌ |
| manage_roles | ✅ | ❌ | ❌ |
| assign_roles | ✅ | ❌ | ❌ |
| manage_hotels | ✅ | ❌ | ❌ |
| view_hotels | ✅ | ✅ | ✅ |
| manage_bookings | ✅ | ✅ | ❌ |
| view_bookings | ✅ | ✅ | ✅ |
| create_booking | ✅ | ✅ | ✅ |
| manage_rooms | ✅ | ✅ | ❌ |
| view_rooms | ✅ | ✅ | ✅ |
| manage_payments | ✅ | ❌ | ❌ |
| view_payments | ✅ | ✅ | ✅ |
| view_reports | ✅ | ✅ | ❌ |
| export_data | ✅ | ❌ | ❌ |
| manage_settings | ✅ | ❌ | ❌ |
| view_logs | ✅ | ❌ | ❌ |

### Testing the Role System

Run the test script to verify the role-based authentication system:

```bash
# Import and run the test in your application
import { runAllTests } from './src/utils/testRoleSystem';
await runAllTests();
```

For complete documentation, see [ROLE_BASED_AUTH.md](./ROLE_BASED_AUTH.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 