import { RoleService } from '../services/roleService';
import { User } from '../models/User';
import { USER_ROLE } from '../types/enum';

/**
 * Test the role-based authentication system
 */
export async function testRoleSystem(): Promise<void> {
  console.log('🧪 Testing Role-Based Authentication System...\n');

  const roleService = new RoleService();

  try {
    // Test 1: Check system roles
    console.log('1. Checking system roles...');
    const { roles } = await roleService.getRoles({ isSystem: true });
    const systemRoleNames = roles.map((role: any) => role.name);
    console.log(`   Found system roles: ${systemRoleNames.join(', ')}`);
    
    if (systemRoleNames.length === 3 && 
        systemRoleNames.includes('admin') && 
        systemRoleNames.includes('teacher') && 
        systemRoleNames.includes('student')) {
      console.log('   ✅ System roles are correctly initialized');
    } else {
      console.log('   ❌ System roles are missing or incorrect');
    }

    // Test 2: Check role permissions
    console.log('\n2. Checking role permissions...');
    const adminPermissions = await roleService.getRolePermissions('admin');
    const teacherPermissions = await roleService.getRolePermissions('teacher');
    const studentPermissions = await roleService.getRolePermissions('student');
    
    console.log(`   Admin permissions: ${adminPermissions.length} permissions`);
    console.log(`   Teacher permissions: ${teacherPermissions.length} permissions`);
    console.log(`   Student permissions: ${studentPermissions.length} permissions`);
    
    if (adminPermissions.length > teacherPermissions.length && 
        teacherPermissions.length > studentPermissions.length) {
      console.log('   ✅ Role hierarchy is correctly implemented');
    } else {
      console.log('   ❌ Role hierarchy is not properly configured');
    }

    // Test 3: Check role hierarchy
    console.log('\n3. Checking role hierarchy...');
    const adminRole = roles.find((role: any) => role.name === 'admin');
    const teacherRole = roles.find((role: any) => role.name === 'teacher');
    const studentRole = roles.find((role: any) => role.name === 'student');
    
    if (adminRole && teacherRole && studentRole) {
      console.log('   ✅ All system roles exist in database');
    } else {
      console.log('   ❌ Some system roles are missing from database');
    }

    // Test 4: Check default user role
    console.log('\n4. Checking default user role...');
    const testUser = await User.findOne().select('role');
    if (testUser) {
      console.log(`   Default user role: ${testUser.role}`);
      if (testUser.role === 'student') {
        console.log('   ✅ Default role is correctly set to student');
      } else {
        console.log('   ❌ Default role is not set to student');
      }
    } else {
      console.log('   ⚠️  No users found in database');
    }

    // Test 5: Test permission checking
    console.log('\n5. Testing permission checking...');
    if (testUser) {
      const hasManageHotels = await roleService.hasPermission(testUser._id.toString(), 'manage_hotels');
      const hasViewHotels = await roleService.hasPermission(testUser._id.toString(), 'view_hotels');
      
      console.log(`   User can manage hotels: ${hasManageHotels}`);
      console.log(`   User can view hotels: ${hasViewHotels}`);
      
      if (testUser.role === 'student') {
        if (!hasManageHotels && hasViewHotels) {
          console.log('   ✅ Student permissions are correctly configured');
        } else {
          console.log('   ❌ Student permissions are not correctly configured');
        }
      }
    }

    console.log('\n🎉 Role-based authentication system test completed!');
    
  } catch (error) {
    console.error('❌ Error testing role system:', error);
  }
}

/**
 * Create a test admin user if none exists
 */
export async function createTestAdmin(): Promise<void> {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      console.log('👤 Creating test admin user...');
      
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJhKz8O', // password: Admin123!
        phoneNumber: '9876543210',
        role: 'admin',
        gender: 'male',
        isEmailVerified: true,
        isPhoneVerified: true,
      });
      
      await adminUser.save();
      console.log('   ✅ Test admin user created: admin@example.com / Admin123!');
    } else {
      console.log('   ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating test admin:', error);
  }
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<void> {
  await createTestAdmin();
  await testRoleSystem();
} 