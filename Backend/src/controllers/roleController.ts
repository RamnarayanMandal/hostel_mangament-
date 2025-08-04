import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import {
  createRoleSchema,
  updateRoleSchema,
  assignRoleSchema,
  bulkAssignRoleSchema,
  roleQuerySchema,
  roleIdSchema,
  updateUserRoleSchema,
} from '../validations/roleValidation';

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  /**
   * Initialize system roles
   */
  async initializeSystemRoles(req: Request, res: Response): Promise<void> {
    try {
      await this.roleService.initializeSystemRoles();
      res.status(200).json({
        success: true,
        message: 'System roles initialized successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initialize system roles',
      });
    }
  }

  /**
   * Create a new role
   */
  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createRoleSchema.parse(req.body);
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const role = await this.roleService.createRole(validatedData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to create role',
        });
      }
    }
  }

  /**
   * Get all roles with optional filtering
   */
  async getRoles(req: Request, res: Response): Promise<void> {
    try {
      const validatedQuery = roleQuerySchema.parse(req.query);
      const result = await this.roleService.getRoles(validatedQuery);
      
      res.status(200).json({
        success: true,
        message: 'Roles retrieved successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve roles',
      });
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { roleId } = roleIdSchema.parse(req.params);
      const role = await this.roleService.getRoleById(roleId);
      
      res.status(200).json({
        success: true,
        message: 'Role retrieved successfully',
        data: role,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to retrieve role',
        });
      }
    }
  }

  /**
   * Update a role
   */
  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { roleId } = roleIdSchema.parse(req.params);
      const validatedData = updateRoleSchema.parse(req.body);
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const role = await this.roleService.updateRole(roleId, validatedData, userId);
      
      res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: role,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error && error.message.includes('cannot be modified')) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to update role',
        });
      }
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { roleId } = roleIdSchema.parse(req.params);
      await this.roleService.deleteRole(roleId);
      
      res.status(200).json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error && error.message.includes('cannot be deleted')) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error && error.message.includes('user(s) are currently assigned')) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to delete role',
        });
      }
    }
  }

  /**
   * Assign role to a user
   */
  async assignRoleToUser(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = assignRoleSchema.parse(req.body);
      const assignedBy = req.user?.userId;
      
      if (!assignedBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const user = await this.roleService.assignRoleToUser(validatedData, assignedBy);
      
      res.status(200).json({
        success: true,
        message: 'Role assigned successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error && error.message.includes('do not have permission')) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to assign role',
        });
      }
    }
  }

  /**
   * Bulk assign role to multiple users
   */
  async bulkAssignRole(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = bulkAssignRoleSchema.parse(req.body);
      const assignedBy = req.user?.userId;
      
      if (!assignedBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const result = await this.roleService.bulkAssignRole(validatedData, assignedBy);
      
      res.status(200).json({
        success: true,
        message: 'Bulk role assignment completed',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error && error.message.includes('do not have permission')) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to assign roles',
        });
      }
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { roleName } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.roleService.getUsersByRole(roleName, page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve users',
      });
    }
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(req: Request, res: Response): Promise<void> {
    try {
      const { roleName } = req.params;
      const permissions = await this.roleService.getRolePermissions(roleName);
      
      res.status(200).json({
        success: true,
        message: 'Role permissions retrieved successfully',
        data: {
          roleName,
          permissions,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve role permissions',
      });
    }
  }

  /**
   * Check if user has specific permission
   */
  async checkUserPermission(req: Request, res: Response): Promise<void> {
    try {
      const { permission } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const hasPermission = await this.roleService.hasPermission(userId, permission);
      
      res.status(200).json({
        success: true,
        message: 'Permission check completed',
        data: {
          userId,
          permission,
          hasPermission,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to check permission',
      });
    }
  }
} 