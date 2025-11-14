class RoleService {
  constructor(db) {
    this.db = db;

  }

  // ----------Create Role---------------
  async createRole({ name, permissions = [] }) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
  
      // 1. Insert the role
      const roleResult = await client.query(
        `INSERT INTO roles (name) VALUES ($1) RETURNING id, name`,
        [name]
      );
      const role = roleResult.rows[0];
  
      // 2. Link permissions if provided
      if (permissions.length > 0) {
        const values = permissions.map((_, idx) => `($1, $${idx + 2})`).join(", ");
        await client.query(
          `INSERT INTO role_permissions (role_id, permission_id) VALUES ${values}`,
          [role.id, ...permissions]
        );
      }
  
      await client.query("COMMIT");
  
      // Return role with assigned permissions
      return { ...role, permissions };
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error creating role:", err.message);
      throw new Error("Failed to create role");
    } finally {
      client.release();
    }
  }
  

  async getRoleByName(name) {
    try {
        const query = `
            SELECT * FROM roles 
            WHERE LOWER(name) = LOWER($1)
        `;
        const result = await this.db.query(query, [name]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in getRoleByName service:', error);
        throw new Error('Failed to fetch role by name');
    }
  }


  async getRoleById(id) {
    try {
        const query = `
            SELECT * FROM roles 
            WHERE id = $1
        `;
        const result = await this.db.query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error in getRoleById service:', error);
        throw new Error('Failed to fetch role by id');
    }
  }

  async getAllRoles() {
    try {
        const query = `SELECT * FROM roles ORDER BY id ASC`; // or DESC if you want newest first
        const result = await this.db.query(query);
        return result.rows; // returns an array of all roles
    } catch (error) {
        console.error('Error in getAllRoles service:', error);
        throw new Error('Failed to fetch all roles');
    }
  }

  async getAllRolesWithPermissions() {
    try {
      const query = `
        SELECT r.id AS role_id, r.name AS role_name,
               p.id AS permission_id
        FROM roles r
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        ORDER BY r.id ASC
      `;
  
      const result = await this.db.query(query);
  
      // Group permission IDs by role
      const rolesMap = new Map();
  
      result.rows.forEach(row => {
        if (!rolesMap.has(row.role_id)) {
          rolesMap.set(row.role_id, {
            id: row.role_id,
            name: row.role_name,
            permissions: []
          });
        }
        if (row.permission_id) {
          rolesMap.get(row.role_id).permissions.push(row.permission_id);
        }
      });
  
      return Array.from(rolesMap.values());
    } catch (error) {
      console.error('Error in getAllRolesWithPermissions service:', error);
      throw new Error('Failed to fetch all roles with permissions');
    }
  }


  async getAllPermissions() {
    try {
      const query = `
        SELECT * FROM permissions ORDER BY id ASC
      `;
  
      const result = await this.db.query(query);
  
      // Group permission IDs by role
      const permissions = result.rows;
  
      return permissions;
    } catch (error) {
      console.error('Error in getAllPermissions service:', error);
      throw new Error('Failed to fetch all permissions');
    }
  }

  async updateRole(roleId, { name, permissions }) {
    if (!roleId) throw new Error("Role ID is required");
  
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
  
      // Convert roleId to number
      const roleIdNum = parseInt(roleId, 10);
  
      // Update role name
      if (name !== undefined) {
        await client.query(`UPDATE roles SET name = $1 WHERE id = $2`, [
          name,
          roleIdNum,
        ]);
      }
  
      // Update permissions if provided
      if (permissions !== undefined) {
        // Delete old permissions
        await client.query(`DELETE FROM role_permissions WHERE role_id = $1`, [
          roleIdNum,
        ]);
  
        // Insert new permissions if array not empty
        if (permissions.length > 0) {
          // Convert permission IDs to numbers
          const permIds = permissions.map((p) => parseInt(p, 10));
  
          const values = permIds.map((_, idx) => `($1, $${idx + 2})`).join(", ");
          await client.query(
            `INSERT INTO role_permissions (role_id, permission_id) VALUES ${values}`,
            [roleIdNum, ...permIds]
          );
        }
      }
  
      await client.query("COMMIT");
  
      return { id: roleIdNum, name, permissions: permissions || [] };
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error updating role:", err.message);
      throw new Error("Failed to update role");
    } finally {
      client.release();
    }
  }
  
  
  

  
  

}

module.exports = RoleService;
