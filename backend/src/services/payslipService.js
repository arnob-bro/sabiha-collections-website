class PayslipService {
    constructor(db) {
      this.db = db;
  
    }
  
    async createPayslip (payslipData) {
        const {
          company_name,
          company_address,
          reference,
          payment_month,
          employee_name,
          designation,
          employee_id,
          pay_date,
          earnings,
          deductions,
          net_pay,
          payment_mode,
          account_holder,
          bank_name,
          bank_branch,
          account_number,
          bkash_transaction,
          authorized_by,
          payee,
          logo,
          logo_url,
          note,
          status
        } = payslipData;
      
        const query = `
          INSERT INTO payslips (
            company_name, company_address, reference, payment_month,
            employee_name, designation, employee_id, pay_date,
            earnings, deductions, net_pay, payment_mode,
            account_holder, bank_name, bank_branch, account_number, bkash_transaction,
            authorized_by, payee, logo, logo_url, note, status
          ) VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11, $12,
            $13, $14, $15, $16, $17,
            $18, $19, $20, $21, $22, $23
          ) RETURNING *;
        `;
      
        const values = [
          company_name, company_address, reference, payment_month,
          employee_name, designation, employee_id, pay_date,
          earnings, deductions, net_pay, payment_mode,
          account_holder, bank_name, bank_branch, account_number, bkash_transaction,
          authorized_by, payee, logo, logo_url, note, status || 'Pending'
        ];
      
        const result = await this.db.query(query, values);
        return result.rows[0];
      };
    
    
      async getPayslips(page = 1, limit = 10, searchTerm = "", status = "") {
        try{
            const offset = (page - 1) * limit;
            const searchPattern = `%${searchTerm.trim()}%`;
        
            const result = await this.db.query(`
            SELECT *
            FROM payslips
            WHERE ($1='' OR reference ILIKE $2 OR payment_month ILIKE $2 OR employee_name ILIKE $2 OR employee_id ILIKE $2 OR designation ILIKE $2)
                AND ($3::text IS NULL OR status=$3)
            ORDER BY created_at DESC
            LIMIT $4 OFFSET $5
            `, [searchTerm, searchPattern, status || null, limit, offset]);
        
            const countResult = await this.db.query(`
            SELECT COUNT(*) AS total
            FROM payslips
            WHERE ($1='' OR reference ILIKE $2 OR payment_month ILIKE $2 OR employee_name ILIKE $2 OR employee_id ILIKE $2 OR designation ILIKE $2)
                AND ($3::text IS NULL OR status=$3)
            `, [searchTerm, searchPattern, status || null]);
        
            const total = parseInt(countResult.rows[0].total, 10);
            return {
            success: true,
            payslips: result.rows,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
            };

        }catch(err){
            console.error("Error in fetching payslips:", err.message);
            throw new Error("Failed to fetch payslips");
        }
      }

    async getPayslipById(payslip_id) {
      try {
        
        const result = await this.db.query(
          `SELECT * FROM payslips WHERE payslip_id =$1`,
          [payslip_id]
        );
        
        const payslip = result.rows[0];
        return payslip;
      } catch (err) {
        console.error("Error in fetching payslip:", err.message);
        throw new Error("Failed to fetch payslip");
      }
    }


    async updatePayslipStatus(payslip_id, status) {
      try {
        
    
        // Update the inquiry
        const result = await this.db.query(
          `UPDATE payslips 
           SET status = $1, updated_at = CURRENT_TIMESTAMP
           WHERE payslip_id = $2
           RETURNING *`,
          [ status, payslip_id]
        );
    
        if (result.rows.length === 0) {
          throw new Error("payslip not found");
        }
    
        const updatedPayslip = result.rows[0];
        return updatedPayslip;
      } catch (err) {
        console.error("Error updating payslip status:", err.message);
        throw new Error("Failed to update payslip status");
      }
    }


    
    
  
  }
  
  module.exports = PayslipService;
  