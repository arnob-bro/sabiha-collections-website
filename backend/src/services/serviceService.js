class ServiceService {
    constructor(db) {
      this.db = db;
  
    }
  
    async create(title, short_desc, key_benefits, our_process, technologies, active, icon) {
      try {
        const result = await this.db.query(
          `INSERT INTO services 
          (title, short_desc, key_benefits, our_process, technologies, active, icon)
          VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6, $7)
          RETURNING *`,
          [
            title,
            short_desc,
            JSON.stringify(key_benefits),
            JSON.stringify(our_process),
            JSON.stringify(technologies),
            active,
            icon
          ]
        );
    
        return result.rows[0];
      } catch (err) {
        console.error("Error in creating this service:", err.message);
        throw new Error("Failed to create this service");
      }
    }
    
    
    async getServices() {
      try {
        
        // Fetch paginated results
        const result = await this.db.query(
          `SELECT * FROM services ORDER BY service_id ASC`,
          []
        );
        
        const services = result.rows;
        return services;
      } catch (err) {
        console.error("Error in fetching services:", err.message);
        throw new Error("Failed to fetch services");
      }
    }

    async getServiceById(service_id) {
      try {
        
        
        const result = await this.db.query(
          `SELECT * FROM services WHERE service_id =$1`,
          [service_id]
        );
        
        const service = result.rows[0];
        return service;
      } catch (err) {
        console.error("Error in fetching service:", err.message);
        throw new Error("Failed to fetch service");
      }
    }


    async updateService(service_id, title,short_desc,key_benefits,our_process,technologies,active,icon) {
      try {
        
    
        // Update the inquiry
        const result = await this.db.query(
          `UPDATE services 
           SET title = $1, short_desc = $2, key_benefits = $3::jsonb, our_process = $4::jsonb,technologies= $5::jsonb, active = $6, icon = $7, updated_at = CURRENT_TIMESTAMP
           WHERE service_id = $8
           RETURNING *`,
          [ title,
            short_desc,
            JSON.stringify(key_benefits),
            JSON.stringify(our_process),
            JSON.stringify(technologies),
            active,
            icon,
            service_id]
        );
    
        if (result.rows.length === 0) {
          throw new Error("service not found");
        }
    
        const updatedService = result.rows[0];
        return updatedService;
      } catch (err) {
        console.error("Error updating service:", err.message);
        throw new Error("Failed to update service");
      }
    }


    
    
  
  }
  
  module.exports = ServiceService;
  