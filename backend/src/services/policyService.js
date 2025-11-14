class PolicyService {
    constructor(db) {
      this.db = db;
  
    }
    
    async getAllPolicies() {
      try {
        const query = `SELECT * FROM policies`;
        const result = await this.db.query(query, []);
        return result.rows || [];
      } catch (error) {
        console.error('Error in getAllPolicies service:', error);
        throw new Error('Failed to fetch policies');
      }
    }


    async getpolicyByType(type) {
        try {
          const query = `SELECT * FROM policies WHERE type = $1`;
          const result = await this.db.query(query, [type]);
          return result.rows[0] || null;
        } catch (error) {
          console.error('Error in getpolicyByType service:', error);
          throw new Error('Failed to fetch policy');
        }
      }


      async updatePolicy(type, title, content) {
        try {
          const query = `
          UPDATE policies 
          SET title = $1, content = $2
          WHERE type = $3
          RETURNING *`;
          const result = await this.db.query(query, [title, content, type]);
          return result.rows[0] || null;
        } catch (error) {
          console.error('Error in updatePolicy service:', error);
          throw new Error('Failed to update policy');
        }
      }
  
    
    
  
  }
  
  module.exports = PolicyService;
  