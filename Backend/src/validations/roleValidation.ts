import { z } from 'zod';
import { PERMISSION } from '../types/enum';

// Schema for creating a new role
export const createRoleSchema = z.object({
  name: z.string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-z_]+$/, 'Role name can only contain lowercase letters and underscores'),
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(z.nativeEnum(PERMISSION))
    .min(1, 'At least one permission is required'),
});

// Schema for updating a role
export const updateRoleSchema = z.object({
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must be less than 100 characters')
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  permissions: z.array(z.nativeEnum(PERMISSION))
    .min(1, 'At least one permission is required')
    .optional(),
  isActive: z.boolean().optional(),
});

// Schema for assigning role to user
export const assignRoleSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required'),
  roleName: z.string()
    .min(1, 'Role name is required'),
});

// Schema for bulk role assignment
export const bulkAssignRoleSchema = z.object({
  userIds: z.array(z.string())
    .min(1, 'At least one user ID is required'),
  roleName: z.string()
    .min(1, 'Role name is required'),
});

// Schema for role query parameters
export const roleQuerySchema = z.object({
  isActive: z.boolean().optional(),
  isSystem: z.boolean().optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).default(1),
  limit: z.string().transform(Number).default(10),
});

// Schema for role ID parameter
export const roleIdSchema = z.object({
  roleId: z.string()
    .min(1, 'Role ID is required'),
});

// Schema for user role update
export const updateUserRoleSchema = z.object({
  role: z.string()
    .min(1, 'Role is required'),
});

// Export types
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type BulkAssignRoleInput = z.infer<typeof bulkAssignRoleSchema>;
export type RoleQueryInput = z.infer<typeof roleQuerySchema>;
export type RoleIdInput = z.infer<typeof roleIdSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>; 