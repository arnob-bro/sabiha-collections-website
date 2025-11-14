const nodemailer = require("nodemailer");
const {generateInquiryReplyTemplate} = require("../utils/generateInquiryReplyTemplate");

class InquiryService {
  constructor(db) {
    this.db = db;

    // Setup email transporter
    this.transporter = nodemailer.createTransport({
      host: "mail.m3techops.com", 
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // ----------Signup---------------
  async makeInquiry(inquiryData) {
    try {
      const {
        first_name,
        last_name,
        email,
        company,
        job_title,
        phone,
        country,
        message
      } = inquiryData;



      // Insert user
      const result = await this.db.query(
        `INSERT INTO inquiries 
        (first_name, last_name, email, company, job_title, phone, country, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING inquiry_id, first_name, last_name, email, company, job_title, phone, country, message, status`,
        [
            first_name,
            last_name,
            email,
            company,
            job_title,
            phone,
            country,
            message
        ]
      );

      const inquiry = result.rows[0];

      

      return { success: true, message: "Inquiry creation successful." };
    } catch (err) {
      console.error("Error in making this inquiry:", err.message);
      throw new Error("Failed to make this inquiry");
    }
  }

  async getInquiries( page , limit , company, email, status ) {
    try {
      const offset = (page - 1) * limit;
  
      // Build dynamic WHERE clause
      const conditions = [];
      const values = [];
  
      if (company) {
        values.push(`%${company}%`);
        conditions.push(`company ILIKE $${values.length}`);
      }
  
      if (email) {
        values.push(`%${email}%`);
        conditions.push(`email ILIKE $${values.length}`);
      }
      if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }
      
  
      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  
      // Fetch paginated results
      const result = await this.db.query(
        `SELECT * FROM inquiries ${whereClause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
        [...values, limit, offset]
      );
  
      // Get total count for pagination
      const countResult = await this.db.query(
        `SELECT COUNT(*) FROM inquiries ${whereClause}`,
        values
      );
      const total = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(total / limit);
  
      return {
        success: true,
        inquiries: result.rows,
        pagination: {
          page: page,
          limit,
          total,
          totalPages
        }
      };
    } catch (err) {
      console.error("Error in fetching inquiries:", err.message);
      throw new Error("Failed to fetch inquiries");
    }
  }
  
  async replyToInquiry(inquiry_id, replyMessage) {
    try {
      const result = await this.db.query(
        `SELECT * FROM inquiries WHERE inquiry_id = $1`,
        [inquiry_id]
      );
  
      if (result.rows.length === 0) throw new Error("Inquiry not found");
  
      const inquiry = result.rows[0];
  
      const { html, text } = generateInquiryReplyTemplate(inquiry, replyMessage);
  
      await this.transporter.sendMail({
        from: `"M3TechOps Team" <${process.env.EMAIL_USER}>`,
        to: inquiry.email,
        subject: "Reply to your inquiry",
        text,
        html,
      });
  
      await this.db.query(
        `UPDATE inquiries SET status = 'Replied' WHERE inquiry_id = $1`,
        [inquiry_id]
      );
  
      return { success: true, message: "Reply sent successfully." };
    } catch (err) {
      console.error("Error in replying to inquiry:", err.message);
      throw new Error("Failed to send reply");
    }
  }
  

  async updateInquiryStatus(inquiry_id, status) {
    try {
      // Validate status
      const allowedStatuses = ["Unread", "Read", "Replied"];
      if (!allowedStatuses.includes(status)) {
        throw new Error(`Invalid status. Allowed values: ${allowedStatuses.join(", ")}`);
      }
  
      // Update the inquiry
      const result = await this.db.query(
        `UPDATE inquiries 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE inquiry_id = $2
         RETURNING inquiry_id, first_name, last_name, email, status`,
        [status, inquiry_id]
      );
  
      if (result.rows.length === 0) {
        throw new Error("Inquiry not found");
      }
  
      return {
        success: true,
        message: `Inquiry status updated to "${status}"`,
        inquiry: result.rows[0],
      };
    } catch (err) {
      console.error("Error updating inquiry status:", err.message);
      throw new Error("Failed to update inquiry status");
    }
  }
  

}

module.exports = InquiryService;
