const supabase = require("../config/supabaseClient.js");

class EmployeeController {
  constructor(employeeService) {
    this.employeeService = employeeService;

    this.getEmployees = this.getEmployees.bind(this);
    this.getEmployeeById = this.getEmployeeById.bind(this);
    this.createEmployee = this.createEmployee.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
  }

  async getEmployees(req, res) {
    try {
      const { page = 1, limit = 10, searchTerm = "", status = "" } = req.query;
      console.log('Fetching employees with params:', { page, limit, searchTerm, status });
      
      const result = await this.employeeService.getEmployees(
        parseInt(page), 
        parseInt(limit), 
        searchTerm, 
        status
      );
      
      res.json(result);
    } catch (err) {
      console.error('Error in getEmployees:', err);
      res.status(500).json({ 
        success: false,
        error: err.message || "Failed to fetch employees" 
      });
    }
  }

  async getEmployeeById(req, res) {
    try {
      const { employee_id } = req.params;
      console.log('Fetching employee by ID:', employee_id);
      
      const employee = await this.employeeService.getEmployeeById(employee_id);
      if (!employee) {
        return res.status(404).json({ 
          success: false,
          error: "Employee not found" 
        });
      }
      
      res.json({
        success: true,
        employee
      });
    } catch (err) {
      console.error('Error in getEmployeeById:', err);
      res.status(500).json({ 
        success: false,
        error: err.message || "Failed to fetch employee" 
      });
    }
  }

  async createEmployee(req, res) {
    try {
      const {
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, emergency_contact, status = 'active'
      } = req.body;

      const imageFile = req.file;

      const result = await this.employeeService.createEmployee({
        employee_id, first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, avatar:imageFile, emergency_contact, status
      });

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee: result.employee,
        initialPassword: result.initialPassword
      });
    } catch (err) {
      console.error('Error in createEmployee:', err);
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async updateEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      const {
        first_name, last_name, email, phone, position,
        role_id, hire_date, address, city, country, emergency_contact, status
      } = req.body;
      const imageFile = req.file;
  
      const updateData = { employee_id };
  
      if (first_name) updateData.first_name = first_name.trim();
      if (last_name) updateData.last_name = last_name.trim();
      if (email) updateData.email = email.trim();
      if (phone) updateData.phone = phone.trim();
      if (position) updateData.position = position.trim();
      if (role_id) updateData.role_id = role_id;
      if (hire_date) updateData.hire_date = hire_date;
      if (address) updateData.address = address.trim();
      if (city) updateData.city = city.trim();
      if (country) updateData.country = country.trim();
      if (status) updateData.status = status;
      if (emergency_contact) updateData.emergency_contact = emergency_contact;
      if (imageFile) {
        const imageFileName = `profile_pic_${Date.now()}_${imageFile.originalname}`;
        const { error: imgErr } = await supabase.storage
          .from("profile_pics")
          .upload(imageFileName, imageFile.buffer, { contentType: imageFile.mimetype });
        if (imgErr) throw imgErr;
          
        const { data: imgUrlData } = supabase.storage
          .from("profile_pics")
          .getPublicUrl(imageFileName);
        updateData.avatar = imgUrlData.publicUrl;
      }
  
      const updatedEmployee = await this.employeeService.updateEmployee(updateData);
  
      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        employee: updatedEmployee
      });
    } catch (err) {
      console.error('Error in updateEmployee:', err);
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      console.log('Deleting employee:', employee_id);
      
      const deletedEmployee = await this.employeeService.deleteEmployee(employee_id);
      
      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
        employee: deletedEmployee
      });
    } catch (err) {
      console.error('Error in deleteEmployee:', err);
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  }
  
}

module.exports = EmployeeController;