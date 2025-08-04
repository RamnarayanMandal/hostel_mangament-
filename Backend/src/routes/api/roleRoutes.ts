import { Router } from 'express';
import { RoleController } from '../../controllers/roleController';
import { AuthMiddleware } from '../../middlewares/authMiddleware';
import { PERMISSION } from '../../types/enum';

const router = Router();
const roleController = new RoleController();

// All routes require authentication
router.use(AuthMiddleware.verifyToken);

// Initialize system roles (admin only)
router.post('/initialize', 
  AuthMiddleware.requireAdmin,
  roleController.initializeSystemRoles.bind(roleController)
);

// Role assignment routes (require assign_roles permission) - specific routes first
router.post('/assign', 
  AuthMiddleware.requirePermission([PERMISSION.ASSIGN_ROLES]),
  roleController.assignRoleToUser.bind(roleController)
);

router.post('/bulk-assign', 
  AuthMiddleware.requirePermission([PERMISSION.ASSIGN_ROLES]),
  roleController.bulkAssignRole.bind(roleController)
);

// User management by role routes (require read_user permission) - specific routes first
// User management by role routes (require read_user permission) - specific routes first
router.get('/users/:name', 
  AuthMiddleware.requirePermission([PERMISSION.READ_USER]),
  roleController.getUsersByRole.bind(roleController)
);

// Permission routes - specific routes first
router.get('/permissions/:name', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_ROLES]),
  roleController.getRolePermissions.bind(roleController)
);

router.get('/check-permission/:perm', 
  roleController.checkUserPermission.bind(roleController)
);

// Role management routes (require manage_roles permission) - parameterized routes last
router.post('/', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_ROLES]),
  roleController.createRole.bind(roleController)
);

router.get('/', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_ROLES]),
  roleController.getRoles.bind(roleController)
);

router.get('/:id', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_ROLES]),
  roleController.getRoleById.bind(roleController)
);

router.put('/:id', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_ROLES]),
  roleController.updateRole.bind(roleController)
);

router.delete('/:id', 
  AuthMiddleware.requirePermission([PERMISSION.MANAGE_ROLES]),
  roleController.deleteRole.bind(roleController)
);

export default router; 