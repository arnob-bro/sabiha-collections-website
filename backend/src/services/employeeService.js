const supabase = require("../config/supabaseClient.js");
class EmployeeService {
  constructor(db, userService, roleService) {
    this.db = db;
    this.userService = userService;
    this.roleService = roleService;
  }

  // --- Helper validation functions ---
  validateEmail(email) {
    const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    return regex.test(email);
  }

  validatePhone(phone) {
    return /^\+?\d{10,14}$/.test(phone);
  }

  validateName(name) {
    return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name);
  }

  validateEmployeeId(id) {
    return /^[A-Za-z0-9_-]{3,20}$/.test(id);
  }

  validateStatus(status) {
    const validStatuses = ['active', 'on_leave', 'terminated', 'probation'];
    return validStatuses.includes(status);
  }

  async validateRole(role_id) {
    if (!role_id) throw new Error("Role ID is required");
    const role = await this.roleService.getRoleById(role_id);
    if (!role) throw new Error("Invalid role");
    return role;
  }

  // --- Create Employee ---
  async createEmployee({
    employee_id, first_name, last_name, email, phone, position,
    role_id, hire_date, address = null, city = null, country = null,
    avatar, emergency_contact = null, status = 'active'
  }) {
    try{
    

    // Basic validations
    if (!employee_id || !first_name || !last_name || !email || !phone || !position || !role_id || !hire_date) {
      throw new Error("All required fields are missing");
    }
    if (!this.validateEmail(email)) throw new Error("Invalid email format");
    if (!this.validatePhone(phone)) throw new Error("Invalid phone number");
    if (!this.validateName(first_name)) throw new Error("Invalid first name");
    if (!this.validateName(last_name)) throw new Error("Invalid last name");
    if (!this.validateEmployeeId(employee_id)) throw new Error("Invalid employee ID format");
    if (!this.validateStatus(status)) throw new Error("Invalid status");
    
    await this.validateRole(role_id);

    // Check if user/email already exists
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) throw new Error("User already exists with this email");

    // Check if employee_id exists
    const existingEmployee = await this.getEmployeeById(employee_id);
    if (existingEmployee) throw new Error("Employee already exists with this employee_id");

    // Create user account with default password
    const initialPassword = "123456";

    const fileName = `profile_pic_${Date.now()}_${avatar.originalname}`;
    const { data, error } = await supabase.storage
      .from("profile_pics")
      .upload(fileName, avatar.buffer, { contentType: avatar.mimetype });
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("profile_pics")
      .getPublicUrl(fileName);

    const avatarUrl = publicUrlData.publicUrl;

    await this.userService.createUser(employee_id, email, initialPassword, "employee");

      // Insert employee into DB
      const query = `
        INSERT INTO employees
        (employee_id, first_name, last_name, phone, position, role_id, hire_date, address, city, country, avatar, emergency_contact, email, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
      `;
      const values = [
        employee_id, first_name, last_name, phone, position, role_id, hire_date,
        address, city, country, avatarUrl, emergency_contact ? JSON.stringify(emergency_contact) : null, 
        email, status
      ];

      console.log('Executing query with values:', values);
      const result = await this.db.query(query, values);
      console.log('Employee created successfully:', result.rows[0]);
      
      return { employee: result.rows[0], initialPassword };
    } catch (error) {
      console.error('Database error in createEmployee:', error);
      throw new Error(`Failed to create employee: ${error.message}`);
    }
  }

  // --- Update Employee ---
  async updateEmployee({
    employee_id, first_name, last_name, email, phone, position,
    role_id, hire_date, address = null, city = null, country = null,
    avatar = null, emergency_contact = null, status = 'active'
  }) {
    try{
      

      // Basic validations
      if (!employee_id || !first_name || !last_name || !email || !phone || !position || !role_id || !hire_date || !status) {
        throw new Error("All fields are required");
      }
      if (!this.validateEmail(email)) throw new Error("Invalid email");
      if (!this.validatePhone(phone)) throw new Error("Invalid phone number");
      if (!this.validateName(first_name)) throw new Error("Invalid first name");
      if (!this.validateName(last_name)) throw new Error("Invalid last name");
      if (!this.validateStatus(status)) throw new Error("Invalid status");
      
      await this.validateRole(role_id);

      // Check if employee exists
      const existingEmployee = await this.getEmployeeById(employee_id);
      if (!existingEmployee) throw new Error("No employee exists with this employee_id");

      // Check if email belongs to another user
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser && existingUser.user_id !== employee_id) {
        throw new Error("User already exists with this email");
      }

      // Update user email if changed
      if (existingEmployee.email !== email) {
        await this.userService.updateUserEmail(employee_id, email);
      }

      

        // Update employee
        const query = `
          UPDATE employees
          SET first_name=$1, last_name=$2, phone=$3, position=$4, role_id=$5, hire_date=$6,
              address=$7, city=$8, country=$9, avatar=$10, emergency_contact=$11, email=$12, status=$13,
              updated_at=CURRENT_TIMESTAMP
          WHERE employee_id=$14
          RETURNING *;
        `;
        const values = [
          first_name, 
          last_name, 
          phone, 
          position, 
          role_id, 
          hire_date,
          address, 
          city, 
          country, 
          avatar, 
          emergency_contact ? JSON.stringify(emergency_contact) : null, 
          email,
          status,
          employee_id
        ];
        
        console.log('Executing update query with values:', values);
        const result = await this.db.query(query, values);
        
        if (result.rows.length === 0) {
          throw new Error("Employee not found or update failed");
        }
        
        console.log('Employee updated successfully:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
      console.error('Database error in updateEmployee:', error);
      throw new Error(`Failed to update employee: ${error.message}`);
    }
  }

  // --- Get Employee by ID ---
  async getEmployeeById(employee_id) {
    try {
      const result = await this.db.query(
        `SELECT * FROM employees WHERE employee_id=$1`,
        [employee_id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getEmployeeById:', error);
      throw error;
    }
  }

  // --- Get Employees with Pagination and Filters ---
  async getEmployees(page = 1, limit = 10, searchTerm = "", status = "") {
    try {
      const offset = (page - 1) * limit;
      const searchPattern = `%${searchTerm.trim()}%`;
    
      let whereConditions = [];
      let queryParams = [];
      let paramCount = 0;

      // Search condition
      if (searchTerm && searchTerm.trim() !== '') {
        paramCount++;
        whereConditions.push(`(
          e.first_name ILIKE $${paramCount} OR 
          e.last_name ILIKE $${paramCount} OR 
          e.email ILIKE $${paramCount} OR 
          e.employee_id ILIKE $${paramCount} OR 
          e.position ILIKE $${paramCount} OR 
          r.name ILIKE $${paramCount}
        )`);
        queryParams.push(searchPattern);
      }

      // Status condition
      if (status && status.trim() !== '') {
        paramCount++;
        whereConditions.push(`e.status = $${paramCount}`);
        queryParams.push(status);
      }

      // Combine where conditions
      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Add pagination parameters
      queryParams.push(limit, offset);

      // Fetch employees with role info
      const employeesQuery = `
        SELECT 
          e.*, 
          r.name as role_name,
          r.id as role_id
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        ${whereClause}
        ORDER BY e.created_at DESC
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;

      const employees = await this.db.query(employeesQuery, queryParams);
    
      // Count for pagination
      const countParams = queryParams.slice(0, paramCount);
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        ${whereClause}
      `;

      const countResult = await this.db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total, 10);
      
      return {
        success: true,
        employees: employees.rows,
        pagination: { 
          page: parseInt(page), 
          limit: parseInt(limit), 
          total, 
          totalPages: Math.ceil(total / limit) 
        }
      };
    } catch (error) {
      console.error('Error in getEmployees:', error);
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }
  }

  // --- Delete Employee ---
  async deleteEmployee(employee_id) {
    try {
      // Check if employee exists
      const existingEmployee = await this.getEmployeeById(employee_id);
      if (!existingEmployee) throw new Error("Employee not found");

      // Delete employee
      const result = await this.db.query(
        `DELETE FROM employees WHERE employee_id=$1 RETURNING *`,
        [employee_id]
      );

      // Also delete associated user account
      await this.userService.deleteUser(employee_id);

      return result.rows[0];
    } catch (error) {
      console.error('Error in deleteEmployee:', error);
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  }
}

module.exports = EmployeeService;