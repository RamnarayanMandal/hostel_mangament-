# Role-Based Authentication System

## Overview

This document describes the comprehensive role-based authentication system implemented in the Hotel Management System. The system supports dynamic role management where administrators can create, modify, and assign custom roles while maintaining a hierarchical permission structure.

## Role System Architecture

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

### Permission System

The system includes comprehensive permissions for different operations:

#### User Management
- `create_user` - Create new users
- `read_user` - View user information
- `update_user` - Modify user details
- `delete_user` - Remove users

#### Role Management
- `manage_roles` - Create, update, delete roles
- `assign_roles` - Assign roles to users

#### Hotel Management
- `manage_hotels` - Full hotel management
- `view_hotels` - View hotel information

#### Booking Management
- `manage_bookings` - Full booking management
- `view_bookings` - View booking information
- `create_booking` - Create new bookings

#### Room Management
- `manage_rooms` - Full room management
- `view_rooms` - View room information

#### Payment Management
- `manage_payments` - Full payment management
- `view_payments` - View payment information

#### Reports and Analytics
- `view_reports` - Access system reports
- `export_data` - Export system data

#### System Settings
- `manage_settings` - Modify system settings
- `view_logs` - Access system logs

## Database Models

### User Model

```typescript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  role: String (required, enum: USER_ROLE, default: 'student'),
  status: String (required, enum: USER_STATUS, default: 'active'),
  gender: String (required, enum: USER_GENDER, default: 'male'),
  password: String (optional - for Google OAuth users),
  phoneNumber: String (required),
  // ... other fields
}
```

### Role Model

```typescript
{
  name: String (required, unique),
  displayName: String (required),
  description: String (optional),
  permissions: [String] (required, enum: PERMISSION),
  isSystem: Boolean (default: false),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: 'User'),
  updatedBy: ObjectId (ref: 'User'),
  timestamps: true
}
```

## API Endpoints

### Role Management

#### Initialize System Roles
```http
POST /api/role/initialize
Authorization: Bearer <token>
```
- **Description**: Initialize system roles (admin, teacher, student)
- **Access**: Admin only
- **Response**: Success message

#### Create Role
```http
POST /api/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "custom_role",
  "displayName": "Custom Role",
  "description": "A custom role with specific permissions",
  "permissions": ["view_hotels", "view_bookings", "create_booking"]
}
```
- **Description**: Create a new custom role
- **Access**: Users with `manage_roles` permission
- **Response**: Created role object

#### Get All Roles
```http
GET /api/role?page=1&limit=10&isActive=true&search=admin
Authorization: Bearer <token>
```
- **Description**: Get paginated list of roles with optional filtering
- **Access**: Users with `manage_roles` permission
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `isActive`: Filter by active status
  - `isSystem`: Filter by system roles
  - `search`: Search in name, displayName, description

#### Get Role by ID
```http
GET /api/role/:roleId
Authorization: Bearer <token>
```
- **Description**: Get specific role details
- **Access**: Users with `manage_roles` permission
- **Response**: Role object with populated creator/updater

#### Update Role
```http
PUT /api/role/:roleId
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "Updated Role Name",
  "description": "Updated description",
  "permissions": ["view_hotels", "manage_bookings"],
  "isActive": true
}
```
- **Description**: Update role details (system roles cannot be modified)
- **Access**: Users with `manage_roles` permission
- **Response**: Updated role object

#### Delete Role
```http
DELETE /api/role/:roleId
Authorization: Bearer <token>
```
- **Description**: Delete a custom role (system roles cannot be deleted)
- **Access**: Users with `manage_roles` permission
- **Validation**: Cannot delete if users are assigned to the role

### Role Assignment

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
- **Description**: Assign a role to a specific user
- **Access**: Users with `assign_roles` permission
- **Validation**: Role hierarchy enforcement

#### Bulk Assign Role
```http
POST /api/role/bulk-assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userIds": ["user1_id", "user2_id", "user3_id"],
  "roleName": "student"
}
```
- **Description**: Assign a role to multiple users
- **Access**: Users with `assign_roles` permission
- **Response**: Success and failed assignments

#### Get Users by Role
```http
GET /api/role/users/:roleName?page=1&limit=10
Authorization: Bearer <token>
```
- **Description**: Get paginated list of users with a specific role
- **Access**: Users with `read_user` permission
- **Response**: Users array with pagination info

### Permission Management

#### Get Role Permissions
```http
GET /api/role/permissions/:roleName
Authorization: Bearer <token>
```
- **Description**: Get all permissions for a specific role
- **Access**: Users with `manage_roles` permission
- **Response**: Role name and permissions array

#### Check User Permission
```http
GET /api/role/check-permission/:permission
Authorization: Bearer <token>
```
- **Description**: Check if current user has a specific permission
- **Access**: Authenticated users
- **Response**: Permission check result

## Middleware

### Authentication Middleware

#### `verifyToken`
- Verifies JWT token from Authorization header
- Attaches user info to `req.user`

#### `requireRole(roles: string[])`
- Checks if user has one of the specified roles
- Returns 403 if user doesn't have required role

#### `requirePermission(permissions: PERMISSION[])`
- Checks if user has any of the specified permissions
- Dynamically checks permissions from database
- Returns 403 if user doesn't have required permissions

#### `requireAdmin`
- Convenience middleware for admin-only routes

#### `requireTeacher`
- Checks if user is teacher or admin

#### `requireStudent`
- Checks if user is student, teacher, or admin

## Usage Examples

### Creating a Custom Role

```javascript
// Create a "moderator" role
const moderatorRole = {
  name: "moderator",
  displayName: "Moderator",
  description: "Can manage bookings and view reports",
  permissions: [
    "view_hotels",
    "manage_bookings",
    "view_bookings",
    "view_rooms",
    "view_payments",
    "view_reports"
  ]
};

// POST /api/role
fetch('/api/role', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(moderatorRole)
});
```

### Assigning Roles

```javascript
// Assign teacher role to a user
const assignment = {
  userId: "user_id_here",
  roleName: "teacher"
};

// POST /api/role/assign
fetch('/api/role/assign', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(assignment)
});
```

### Checking Permissions

```javascript
// Check if user can manage bookings
fetch('/api/role/check-permission/manage_bookings', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => response.json())
.then(data => {
  if (data.data.hasPermission) {
    // User can manage bookings
    showBookingManagementUI();
  } else {
    // User cannot manage bookings
    showAccessDeniedMessage();
  }
});
```

## Security Features

### Role Hierarchy Enforcement
- Users can only assign roles they have permission to manage
- System roles (admin, teacher, student) follow predefined hierarchy
- Custom roles can only be assigned by admins

### Permission Validation
- All API endpoints validate permissions before execution
- Dynamic permission checking from database
- Timeout protection for permission checks

### System Role Protection
- System roles cannot be modified or deleted
- System roles are automatically initialized
- System roles have predefined permissions

### Input Validation
- All inputs validated using Zod schemas
- Role names must follow naming conventions
- Permission arrays validated against enum values

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Role not found"
}
```

#### 409 Conflict
```json
{
  "success": false,
  "message": "Role with this name already exists"
}
```

#### 409 Conflict (Cannot Delete)
```json
{
  "success": false,
  "message": "Cannot delete role. 5 user(s) are currently assigned this role."
}
```

## Best Practices

### Role Design
1. **Principle of Least Privilege**: Assign minimum required permissions
2. **Descriptive Names**: Use clear, descriptive role names
3. **Documentation**: Always include role descriptions
4. **Testing**: Test role assignments before production

### Permission Management
1. **Regular Audits**: Periodically review role permissions
2. **Incremental Permissions**: Start with minimal permissions, add as needed
3. **Role Templates**: Create templates for common role types
4. **Documentation**: Document permission requirements

### Security Considerations
1. **Role Hierarchy**: Respect role hierarchy when assigning roles
2. **System Roles**: Never modify system roles
3. **Permission Validation**: Always validate permissions on both client and server
4. **Audit Logging**: Log all role and permission changes

## Migration Guide

### From Static Roles to Dynamic Roles

1. **Initialize System Roles**
   ```bash
   POST /api/role/initialize
   ```

2. **Create Custom Roles**
   - Identify common permission patterns
   - Create roles with appropriate permissions
   - Document role purposes

3. **Assign Roles to Users**
   - Review existing user roles
   - Assign appropriate custom roles
   - Test permission functionality

4. **Update Application Code**
   - Replace hardcoded role checks with permission checks
   - Update UI to reflect dynamic roles
   - Test all role-based features

## Troubleshooting

### Common Issues

#### Permission Check Timeout
- **Cause**: Database connection issues or slow queries
- **Solution**: Check database performance and connection pool

#### Role Assignment Fails
- **Cause**: Role hierarchy violation or invalid role name
- **Solution**: Verify role exists and user has permission to assign it

#### System Role Modification Attempt
- **Cause**: Attempting to modify admin, teacher, or student roles
- **Solution**: Create custom roles instead of modifying system roles

#### Circular Role Dependencies
- **Cause**: Complex role hierarchy creating loops
- **Solution**: Simplify role hierarchy and avoid circular references

## Future Enhancements

### Planned Features
1. **Role Templates**: Predefined role templates for common use cases
2. **Role Inheritance**: Support for role inheritance and composition
3. **Temporary Roles**: Time-limited role assignments
4. **Role Analytics**: Usage statistics and role effectiveness metrics
5. **Bulk Operations**: Enhanced bulk role and permission management
6. **Role Approval Workflow**: Multi-step approval for role changes
7. **Role Versioning**: Track role changes and rollback capabilities

### Integration Opportunities
1. **LDAP/Active Directory**: Integration with enterprise directory services
2. **SSO Providers**: Single sign-on integration with role mapping
3. **Audit Systems**: Integration with enterprise audit and compliance systems
4. **Notification Systems**: Automated notifications for role changes 