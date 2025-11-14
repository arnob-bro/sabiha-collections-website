const nodemailer = require("nodemailer");
class NewsLetterService {
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
  
    // ----------Create Role---------------
  async subscribe({email}) {
      try {
  
        // Insert role
        const result = await this.db.query(
          `INSERT INTO subscribers (email) VALUES ($1) RETURNING *`,
          [email]
        );
  
        const subscriber = result.rows[0];
  
        return subscriber;
      } catch (err) {
        console.error("Error in subscribing:", err.message);
        throw new Error("Failed to subscribe");
      }
    }
  
    async getSubscriptionByEmail(email) {
      try {
          const query = `
              SELECT * FROM subscribers 
              WHERE LOWER(email) = LOWER($1)
          `;
          const result = await this.db.query(query, [email]);
          return result.rows[0] || null;
      } catch (error) {
          console.error('Error in getSubscriptionByEmail service:', error);
          throw new Error('Failed to fetch subscriber by email');
      }
    }


    async getSubscribers( page , limit , email, status ) {
        try {
          const offset = (page - 1) * limit;
      
          // Build dynamic WHERE clause
          const conditions = [];
          const values = [];
      
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
            `SELECT * FROM subscribers ${whereClause} ORDER BY subscribed_date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
            [...values, limit, offset]
          );
      
          // Get total count for pagination
          const countResult = await this.db.query(
            `SELECT COUNT(*) FROM subscribers ${whereClause}`,
            values
          );
          const total = parseInt(countResult.rows[0].count, 10);
          const totalPages = Math.ceil(total / limit);
      
          return {
            success: true,
            subscribers: result.rows,
            pagination: {
              page: page,
              limit,
              total,
              totalPages
            }
          };
        } catch (err) {
          console.error("Error in fetching subscribers:", err.message);
          throw new Error("Failed to fetch subscribers");
        }
      }
    

      async updateSubscriberStatus (subscriber_id, status) {
        try {
          const result = await this.db.query(
            `UPDATE subscribers 
             SET status = $1
             WHERE subscriber_id = $2
             RETURNING *`,
            [status, subscriber_id]
          );
      
          return result.rows[0]; 
        } catch (err) {
          console.error(err);
          throw err;
        }
      }


      async createNewsletter({ title, content, status = "Draft" }) {
        try {
          const result = await this.db.query(
            `INSERT INTO newsletters (title, content, status)
             VALUES ($1, $2, $3)
             RETURNING newsletter_id, title, content, status, created_at`,
            [title, content, status]
          );
      
          return result.rows[0] ;
        } catch (err) {
          console.error("Error creating newsletter:", err);
          return { success: false, message: "Failed to create newsletter" };
        }
      }
      

      async getNewsletters(page = 1, limit = 10, title, status) {
        try {
          // Ensure positive pagination values
          const safePage = Math.max(1, page);
          const safeLimit = Math.max(1, limit);
          const offset = (safePage - 1) * safeLimit;
      
          // Build dynamic WHERE clause
          const conditions = [];
          const values = [];
      
          if (title) {
            values.push(`%${title}%`);
            conditions.push(`title ILIKE $${values.length}`);
          }
          if (status) {
            values.push(status);
            conditions.push(`status = $${values.length}`);
          }
      
          const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";
      
          // Fetch paginated results
          const result = await this.db.query(
            `SELECT * 
             FROM newsletters 
             ${whereClause} 
             ORDER BY created_at DESC 
             LIMIT $${values.length + 1} 
             OFFSET $${values.length + 2}`,
            [...values, safeLimit, offset]
          );
      
          // Get total count for pagination
          const countResult = await this.db.query(
            `SELECT COUNT(*) FROM newsletters ${whereClause}`,
            values
          );
      
          const total = parseInt(countResult.rows[0].count, 10) || 0;
          const totalPages = Math.ceil(total / safeLimit);
      
          return {
            success: true,
            newsletters: result.rows,
            pagination: {
              page: safePage,
              limit: safeLimit,
              total,
              totalPages,
            },
          };
        } catch (err) {
          console.error("Error fetching newsletters:", err);
          return { success: false, message: "Failed to fetch newsletters" };
        }
      }
      



      async updateNewsletter(newsletter_id, title, content, status, sent_date) {
        try {
          const result = await this.db.query(
            `UPDATE newsletters
             SET title = $1,
                 content = $2,
                 status = $3,
                 sent_date = $4
             WHERE newsletter_id = $5
             RETURNING *`,
            [title, content, status, sent_date, newsletter_id]
          );
      
          if (result.rows.length === 0) {
            return { success: false, message: "Newsletter not found" };
          }
      
          return result.rows[0] ;
        } catch (err) {
          console.error("Error updating newsletter:", err);
          return { success: false, message: "Failed to update newsletter" };
        }
      }
      


      async sendNewsletter(newsletter_id) {
        try {
          // Get the newsletter
          const result = await this.db.query(
            `SELECT * FROM newsletters WHERE newsletter_id = $1`,
            [newsletter_id]
          );
          const newsletter = result.rows[0];
          if (!newsletter) {
            return { success: false, message: "Newsletter not found" };
          }
      
          // Get all active subscribers
          const res2 = await this.db.query(
            `SELECT * FROM subscribers WHERE status = 'Active'`
          );
          const subscribers = res2.rows;
      
          if (subscribers.length === 0) {
            return { success: false, message: "No active subscribers found" };
          }
      
          // Send emails, handling failures individually
          const sendResults = await Promise.allSettled(
            subscribers.map(subscriber =>
              this.transporter.sendMail({
                from: `"M3TechOps Team" <${process.env.EMAIL_USER}>`,
                to: subscriber.email,
                subject: newsletter.title,
                html: newsletter.content,
              })
            )
          );
      
          // Separate successes and failures
          const failedEmails = sendResults
            .map((r, i) => (r.status === "rejected" ? subscribers[i].email : null))
            .filter(Boolean);
      
          if (failedEmails.length > 0) {
            console.warn("Failed to send to these emails:", failedEmails);
          }

          if(subscribers.length === failedEmails.length){
            return {
              success: false,
              message: `Newsletter sent. Failed for ${failedEmails.length} subscriber(s)`,
              failedEmails,
              totalSubscribers: subscribers.length
            };
          }

          const updateStatus = await this.db.query(
            `UPDATE newsletters
             SET status = $1,
                 sent_date = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE newsletter_id = $2
             RETURNING *`,
            ["Sent", newsletter_id]
          );
      
          return {
            success: true,
            message: `Newsletter sent. Failed for ${failedEmails.length} subscriber(s)`,
            failedEmails,
            totalSubscribers: subscribers.length,
            newsletter: updateStatus.rows[0]
          };
        } catch (err) {
          console.error("Error sending newsletter:", err);
          return { success: false, message: "Failed to send newsletter" };
        }
      }
      
      



  
  }
  
  module.exports = NewsLetterService;
  