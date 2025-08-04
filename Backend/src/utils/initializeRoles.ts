import { RoleService } from '../services/roleService';

/**
 * Initialize system roles on application startup
 */
export async function initializeSystemRoles(): Promise<void> {
  try {
    const roleService = new RoleService();
    await roleService.initializeSystemRoles();
    console.log('✅ System roles initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize system roles:', error);
    // Don't throw error to prevent application startup failure
  }
}

/**
 * Check if system roles exist
 */
export async function checkSystemRoles(): Promise<boolean> {
  try {
    const roleService = new RoleService();
    const { roles } = await roleService.getRoles({ isSystem: true });
    
    const expectedRoles = ['admin', 'teacher', 'student'];
    const existingRoleNames = roles.map((role: any) => role.name);
    
    const missingRoles = expectedRoles.filter(roleName => 
      !existingRoleNames.includes(roleName)
    );
    
    if (missingRoles.length > 0) {
      console.log(`⚠️  Missing system roles: ${missingRoles.join(', ')}`);
      return false;
    }
    
    console.log('✅ All system roles are present');
    return true;
  } catch (error) {
    console.error('❌ Failed to check system roles:', error);
    return false;
  }
} 