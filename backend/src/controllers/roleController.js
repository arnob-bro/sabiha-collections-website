class RoleController {
    constructor(roleService) {
      this.roleService = roleService;
  
      // Bind methods so 'this' works in routes
      this.createRole = this.createRole.bind(this);
      this.getAllRoles = this.getAllRoles.bind(this);
      this.getAllRolesWithPermissions = this.getAllRolesWithPermissions.bind(this);
      this.getAllPermissions = this.getAllPermissions.bind(this);
      this.updateRole = this.updateRole.bind(this);

    }
  
    async createRole(req, res) {
        try {
          const { name, permissions = [] } = req.body;
      
          // ✅ Validate name
          if (!name) {
            return res.status(400).json({
              success: false,
              message: "Role name is required",
            });
          }
      
          if (typeof name !== "string") {
            return res.status(400).json({
              success: false,
              message: "Role name must be a string",
            });
          }
      
          if (name.trim().length === 0) {
            return res.status(400).json({
              success: false,
              message: "Role name cannot be only whitespace",
            });
          }
      
          if (name.length > 20) {
            return res.status(400).json({
              success: false,
              message: "Role name cannot exceed 20 characters",
            });
          }
      
          const trimmedName = name.trim();
      
          // ✅ Validate permissions (optional)
          if (!Array.isArray(permissions)) {
            return res.status(400).json({
              success: false,
              message: "Permissions must be an array",
            });
          }
      
          // Check if role already exists
          const existingRole = await this.roleService.getRoleByName(trimmedName);
          if (existingRole) {
            return res.status(409).json({
              success: false,
              message: "Role with this name already exists",
            });
          }
      
          // ✅ Create new role
          const newRole = await this.roleService.createRole({
            name: trimmedName,
            permissions,
          });
      
          return res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: newRole,
          });
        } catch (error) {
          console.error("Error creating role:", error);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
              process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong",
          });
        }
    }
      

    async getAllRoles(req, res) {
        try {
            // Fetch all roles from the service
            const roles = await this.roleService.getAllRoles();
    
            return res.status(200).json({
                success: true,
                message: 'Roles fetched successfully',
                data: roles
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }


    async getAllRolesWithPermissions(req, res) {
        try {
            // Fetch all roles from the service
            const roles = await this.roleService.getAllRolesWithPermissions();
    
            return res.status(200).json({
                success: true,
                message: 'Roles fetched successfully',
                data: roles
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }


    async getAllPermissions(req, res) {
        try {
            // Fetch all roles from the service
            const permissions = await this.roleService.getAllPermissions();
    
            return res.status(200).json({
                success: true,
                message: 'permissions fetched successfully',
                data: permissions
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }

    async updateRole(req, res) {
        try {
          const { id } = req.params; // assuming roleId comes from URL
          const { name, permissions } = req.body;
      
          // ✅ Check if role exists
        //   const existingRole = await this.roleService.getRoleById(roleId);
        //   if (!existingRole) {
        //     return res.status(404).json({
        //       success: false,
        //       message: "Role not found",
        //     });
        //   }
      
          // ✅ Validate name (optional update)
          let trimmedName;
          if (name !== undefined) {
            if (typeof name !== "string") {
              return res.status(400).json({
                success: false,
                message: "Role name must be a string",
              });
            }
      
            trimmedName = name.trim();
            if (trimmedName.length === 0) {
              return res.status(400).json({
                success: false,
                message: "Role name cannot be empty or whitespace",
              });
            }
      
            if (trimmedName.length > 20) {
              return res.status(400).json({
                success: false,
                message: "Role name cannot exceed 20 characters",
              });
            }
      
            // // Check for duplicate names (excluding the current role)
            // const duplicateRole = await this.roleService.getRoleByName(trimmedName);
            // if (duplicateRole && duplicateRole.id !== parseInt(roleId, 10)) {
            //   return res.status(409).json({
            //     success: false,
            //     message: "Another role with this name already exists",
            //   });
            // }
          }
      
          // ✅ Validate permissions (optional update)
          if (permissions !== undefined && !Array.isArray(permissions)) {
            return res.status(400).json({
              success: false,
              message: "Permissions must be an array",
            });
          }
      
          // ✅ Build update data
          const updateData = {};
          if (trimmedName !== undefined) updateData.name = trimmedName;
          if (permissions !== undefined) updateData.permissions = permissions;
      
          // ✅ Update role
          const updatedRole = await this.roleService.updateRole(id, updateData);
      
          return res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: updatedRole,
          });
        } catch (error) {
          console.error("Error updating role:", error);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
              process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong",
          });
        }
      }
      
      
}
  
  module.exports = RoleController;
  