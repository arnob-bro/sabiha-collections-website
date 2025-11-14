const nodemailer = require("nodemailer");
const supabase = require("../config/supabaseClient.js");
const crypto = require("crypto");
class TestimonialService {
    constructor(db) {
      this.db = db;

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

    generateTestimonialToken() {
        return crypto.randomBytes(32).toString("hex"); // random string
    }


    async initTestimonial({ client_name="", client_email, company_name="", designation=""}){

        const token = this.generateTestimonialToken();
        const link = `${process.env.FRONTEND_URL}/testimonial/${token}`;

        //insert testimonial
        const result = await this.db.query(
            `INSERT INTO testimonials 
            (client_name, client_email, company_name, designation, token)
           VALUES ($1,$2,$3,$4,$5)
           RETURNING *`,
            [
                client_name, 
                client_email, 
                company_name, 
                designation,
                token
            ]     
        );

        this.transporter.sendMail({
          from: `"M3TechOps Team" <${process.env.EMAIL_USER}>`,
          to: client_email,
          subject: `For Your Precious Testimonial`,
          html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>We value your feedback!</h2>
              <p>Please click the button below to provide your testimonial:</p>
              <a href="${link}" 
                  style="display:inline-block; padding:10px 20px; background:#22577a; color:#fff; text-decoration:none; border-radius:5px;">
                  Give Testimonial
              </a>
              <p>If the button doesn’t work, copy and paste this link into your browser:</p>
              <p><a href="${link}">${link}</a></p>
              </div>
          `,
      });

        return result.rows[0];
    }

    async getTestimonials(page = 1, limit = 10, searchTerm = "", status = "") {
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;
      const offset = (pageNumber - 1) * limitNumber;
  
      const searchPattern = `%${searchTerm.trim()}%`;
  
      // Status filter using boolean flag safely
      let statusValue = null;
      if (status === "active") statusValue = true;
      else if (status === "inactive") statusValue = false;
  
      // Build query with parameters only
      const values = [searchTerm, searchPattern, limitNumber, offset];
      let statusClause = "";
      if (statusValue !== null) {
          values.push(statusValue);
          statusClause = `AND active = $${values.length}`;
      }
  
      const testimonialsQuery = `
        SELECT *
        FROM testimonials
        WHERE ($1 = '' OR client_name ILIKE $2 OR client_email ILIKE $2 OR company_name ILIKE $2 OR designation ILIKE $2)
        ${statusClause}
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
      `;
  
      const testimonialsResult = await this.db.query(testimonialsQuery, values);
  
      // Count total
      const countValues = [searchTerm, searchPattern];
      let countClause = "";
      if (statusValue !== null) {
          countValues.push(statusValue);
          countClause = `AND active = $${countValues.length}`;
      }
  
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM testimonials
        WHERE ($1 = '' OR client_name ILIKE $2 OR client_email ILIKE $2 OR company_name ILIKE $2 OR designation ILIKE $2)
        ${countClause}
      `;
      const countResult = await this.db.query(countQuery, countValues);
  
      const total = parseInt(countResult.rows[0].total, 10);
  
      return {
          success: true,
          testimonials: testimonialsResult.rows || [],
          pagination: {
              page: pageNumber,
              limit: limitNumber,
              total,
              totalPages: Math.ceil(total / limitNumber)
          }
      };
    }

    async getAllActiveTestimonials() {
  
      const testimonialsQuery = `
        SELECT *
        FROM testimonials
        WHERE active = TRUE
        ORDER BY created_at DESC
      `;
  
      const testimonialsResult = await this.db.query(testimonialsQuery, []);
  
      return {
          success: true,
          testimonials: testimonialsResult.rows || []
      };
    }

    async getTestimonialByToken(token) {
      try {
      const result = await this.db.query(
        `SELECT * FROM testimonials WHERE token = $1`,
        [token]
      );
      return result.rows[0] || null;
      } catch (err) {
        console.error("Error fetching testimonial by token:", err);
        throw new Error("Failed to fetch testimonial by token");
      }
    }


    async getTestimonialFeedbackStatusByToken(token) {
      try {
        const result = await this.db.query(
          `SELECT feedback_taken FROM testimonials WHERE token = $1`,
          [token]
        );
    
        if (result.rows.length === 0) {
          return null; // token not found
        }
    
        // return the actual boolean value (true/false), not null unless no record
        return result.rows[0].feedback_taken;
      } catch (err) {
        console.error("Error fetching testimonial feedback status by token:", err.message || err);
        throw new Error("Failed to fetch testimonial feedback status by token");
      }
    }
    

    // Submit testimonial feedback
    async submitTestimonial({ token, client_name, client_email, feedback, imageFile, company_name, designation }) {
      try {
        // Ensure the token is valid and testimonial not already taken
        const check = await this.db.query(
          `SELECT testimonial_id, feedback_taken 
          FROM testimonials 
          WHERE token = $1`,
          [token]
        );

        if (check.rows.length === 0 || check.rows[0].feedback_taken) {
          return null; // invalid or already submitted
        }

        const fileName = `testimonial_${Date.now()}_${imageFile.originalname}`;
        const { data, error } = await supabase.storage
          .from("testimonials")
          .upload(fileName, imageFile.buffer, { contentType: imageFile.mimetype });
        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from("testimonials")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;

        // Update the testimonial with feedback
        await this.db.query(
          `UPDATE testimonials 
          SET feedback = $1, imageUrl = $2, company_name = $3, designation = $4, client_name = $5, client_email= $6,
              feedback_taken = TRUE, active = TRUE, updated_at = CURRENT_TIMESTAMP
          WHERE token = $7`,
          [feedback, imageUrl, company_name, designation, client_name, client_email, token]
        );

        return true;
      } catch (err) {
        console.error("Error submitting testimonial in service:", err);
        throw new Error("Failed to submit testimonial");
      }
    }

    async updateActiveStatus({ testimonial_id, active }) {
      try {
        const result = await this.db.query(
          `UPDATE testimonials 
           SET active = $1
           WHERE testimonial_id = $2
           RETURNING *`,   // good practice: return updated row
          [active, testimonial_id]   // ✅ correct order
        );
        return result.rows[0] || null;
      } catch (err) {
        console.error("Error updating testimonial active status:", err);
        throw new Error("Failed to update testimonial active status");
      }
    }
    
  
  
    
  
}
  
  module.exports = TestimonialService;
  