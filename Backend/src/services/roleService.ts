import { Role } from '../models/Role';
import { User } from '../models/User';
import { USER_ROLE, ROLE_HIERARCHY, ROLE_PERMISSIONS } from '../types/enum';
import { CreateRoleInput, UpdateRoleInput, AssignRoleInput, BulkAssignRoleInput } from '../validations/roleValidation';

export class RoleService {
  /**
   * Initialize system roles if they don't exist
   */
  async initializeSystemRoles(): Promise<void> {
    const systemRoles = [
      {
        name: USER_ROLE.ADMIN,
        displayName: 'Administrator',
        description: 'Full system administrator with all permissions',
        permissions: ROLE_PERMISSIONS[USER_ROLE.ADMIN],
        isSystem: true,
      },
      {
        name: USER_ROLE.TEACHER,
        displayName: 'Teacher',
        description: 'Teacher with limited administrative permissions',
        permissions: ROLE_PERMISSIONS[USER_ROLE.TEACHER],
        isSystem: true,
      },
      {
        name: USER_ROLE.STUDENT,
        displayName: 'Student',
        description: 'Student with basic permissions',
        permissions: ROLE_PERMISSIONS[USER_ROLE.STUDENT],
        isSystem: true,
      },
    ];

    for (const roleData of systemRoles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create({
          ...roleData,
          // createdBy is not required for system roles
        });
      }
    }
  }

  /**
   * Create a new role
   */
  async createRole(roleData: CreateRoleInput, createdBy: string): Promise<any> {
    // Check if role name already exists
    const existingRole = await Role.findOne({ name: roleData.name });
    if (existingRole) {
      throw new Error('Role with this name already exists');
    }

    const role = await Role.create({
      ...roleData,
      createdBy,
    });

    return role;
  }

  /**
   * Get all roles with optional filtering
   */
  async getRoles(query: {
    isActive?: boolean;
    isSystem?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ roles: any[]; total: number; page: number; totalPages: number }> {
    const { isActive, isSystem, search, page = 1, limit = 10 } = query;
    
    const filter: any = {};
    
    if (isActive !== undefined) filter.isActive = isActive;
    if (isSystem !== undefined) filter.isSystem = isSystem;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const [roles, total] = await Promise.all([
      Role.find(filter)
        .populate('createdBy', 'firstName lastName email')
        .populate('updatedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Role.countDocuments(filter),
    ]);

    return {
      roles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string): Promise<any> {
    const role = await Role.findById(roleId)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    if (!role) {
      throw new Error('Role not found');
    }
    
    return role;
  }

  /**
   * Get role by name
   */
  async getRoleByName(roleName: string): Promise<any> {
    const role = await Role.findOne({ name: roleName })
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    if (!role) {
      throw new Error('Role not found');
    }
    
    return role;
  }

  /**
   * Update a role
   */
  async updateRole(roleId: string, updateData: UpdateRoleInput, updatedBy: string): Promise<any> {
    const role = await Role.findById(roleId);
    
    if (!role) {
      throw new Error('Role not found');
    }
    
    if (role.isSystem) {
      throw new Error('System roles cannot be modified');
    }
    
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      {
        ...updateData,
        updatedBy,
      },
      { new: true }
    ).populate('createdBy', 'firstName lastName email')
     .populate('updatedBy', 'firstName lastName email');
    
    return updatedRole;
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId: string): Promise<void> {
    const role = await Role.findById(roleId);
    
    if (!role) {
      throw new Error('Role not found');
    }
    
    if (role.isSystem) {
      throw new Error('System roles cannot be deleted');
    }
    
    // Check if any users are using this role
    const usersWithRole = await User.countDocuments({ role: role.name });
    if (usersWithRole > 0) {
      throw new Error(`Cannot delete role. ${usersWithRole} user(s) are currently assigned this role.`);
    }
    
    await Role.findByIdAndDelete(roleId);
  }

  /**
   * Assign role to a user
   */
  async assignRoleToUser(assignData: AssignRoleInput, assignedBy: string): Promise<any> {
    const { userId, roleName } = assignData;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if role exists
    const role = await Role.findOne({ name: roleName, isActive: true });
    if (!role) {
      throw new Error('Role not found or inactive');
    }
    
    // Check if the assigning user has permission to assign this role
    const assigningUser = await User.findById(assignedBy);
    if (!assigningUser) {
      throw new Error('Assigning user not found');
    }
    
    if (!this.canAssignRole(assigningUser.role, roleName)) {
      throw new Error('You do not have permission to assign this role');
    }
    
    // Update user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: roleName },
      { new: true }
    ).select('-password');
    
    return updatedUser;
  }

  /**
   * Bulk assign role to multiple users
   */
  async bulkAssignRole(assignData: BulkAssignRoleInput, assignedBy: string): Promise<{
    success: string[];
    failed: { userId: string; error: string }[];
  }> {
    const { userIds, roleName } = assignData;
    
    // Check if role exists
    const role = await Role.findOne({ name: roleName, isActive: true });
    if (!role) {
      throw new Error('Role not found or inactive');
    }
    
    // Check if the assigning user has permission to assign this role
    const assigningUser = await User.findById(assignedBy);
    if (!assigningUser) {
      throw new Error('Assigning user not found');
    }
    
    if (!this.canAssignRole(assigningUser.role, roleName)) {
      throw new Error('You do not have permission to assign this role');
    }
    
    const success: string[] = [];
    const failed: { userId: string; error: string }[] = [];
    
    for (const userId of userIds) {
      try {
        const user = await User.findById(userId);
        if (!user) {
          failed.push({ userId, error: 'User not found' });
          continue;
        }
        
        await User.findByIdAndUpdate(userId, { role: roleName });
        success.push(userId);
      } catch (error) {
        failed.push({ userId, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
    
    return { success, failed };
  }

  /**
   * Get users by role
   */
  async getUsersByRole(roleName: string, page = 1, limit = 10): Promise<{
    users: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find({ role: roleName })
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments({ role: roleName }),
    ]);
    
    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Check if a user can assign a specific role based on role hierarchy
   */
  private canAssignRole(userRole: string, targetRole: string): boolean {
    // System roles (admin, teacher, student) follow the hierarchy
    if (Object.values(USER_ROLE).includes(userRole as USER_ROLE)) {
      const manageableRoles = ROLE_HIERARCHY[userRole as USER_ROLE] || [];
      return manageableRoles.includes(targetRole as USER_ROLE) || userRole === targetRole;
    }
    
    // For custom roles, only admins can assign them
    return userRole === USER_ROLE.ADMIN;
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleName: string): Promise<string[]> {
    const role = await Role.findOne({ name: roleName, isActive: true });
    
    if (role) {
      return role.permissions;
    }
    
    // Fallback to system role permissions
    if (Object.values(USER_ROLE).includes(roleName as USER_ROLE)) {
      return ROLE_PERMISSIONS[roleName as USER_ROLE] || [];
    }
    
    return [];
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) {
      return false;
    }
    
    const permissions = await this.getRolePermissions(user.role);
    return permissions.includes(permission);
  }
} 