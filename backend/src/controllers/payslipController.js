class PayslipController {
  constructor(payslipService) {
    this.payslipService = payslipService;
  
    // Bind methods so 'this' works in routes
    this.createPayslip = this.createPayslip.bind(this);
    this.getPayslips = this.getPayslips.bind(this);
    this.getPayslipById = this.getPayslipById.bind(this);
    this.updatePayslipStatus = this.updatePayslipStatus.bind(this);
  }
  
  async createPayslip (req, res) {
      try {
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
          } = req.body;

          const payslip = await this.payslipService.createPayslip({
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
              });
          res.status(201).json(payslip);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to create payslip" });
        }
  }

  async getPayslips(req, res) {
      try {
        const { page, limit, searchTerm, status } = req.query;
        
    
        const payslips = await this.payslipService.getPayslips(
          page,
          limit,
          searchTerm,
          status
        );
    
        res.status(200).json(payslips);
      } catch (err) {
        console.error("Error fetching payslips:", err);
        res.status(400).json({ error: err.message });
      }
  }
    

  async getPayslipById (req, res) {
        try {
          const payslip = await this.payslipService.getPayslipById(req.params.id);
          if (!payslip) return res.status(404).json({ error: "Payslip not found" });
          res.json(payslip);
        } catch (err) {
          res.status(500).json({ error: "Failed to fetch payslip" });
        }
  }

  async updatePayslipStatus (req, res) {
        try {
            const { payslip_id } = req.params;
            const { status } = req.body;

          const updated = await this.payslipService.updatePayslipStatus(payslip_id, status);
          if (!updated) return res.status(404).json({ error: "Payslip not found" });
          res.json({success: true, updated});
        } catch (err) {
          res.status(500).json({ error: "Failed to update payslip" });
        }
  }

}
  
  module.exports = PayslipController;
  