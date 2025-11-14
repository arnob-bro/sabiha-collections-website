const supabase = require("../config/supabaseClient.js");

class PortfolioService {
  constructor(db) {
    this.db = db;
  }

  // Get all portfolio items
  async getAll() {
    try {
      const result = await this.db.query('SELECT * FROM portfolio_items ORDER BY portfolio_item_id ASC');
      return result.rows;
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      throw err;
    }
  }

  async getActivePortfolios(page = 1, limit = 10, category = "", active = true) {
    try {
      const offset = (page - 1) * limit;
      const searchPattern = `%${category.trim()}%`;
  
      const result = await this.db.query(
        `
        SELECT *
        FROM portfolio_items
        WHERE ($1 = '' OR category ILIKE $2)
          AND active = $3
        ORDER BY created_at DESC
        LIMIT $4 OFFSET $5
        `,
        [category, searchPattern, active, limit, offset]
      );
  
      const countResult = await this.db.query(
        `
        SELECT COUNT(*) AS total
        FROM portfolio_items
        WHERE ($1 = '' OR category ILIKE $2)
          AND active = $3
        `,
        [category, searchPattern, active]
      );
  
      const total = parseInt(countResult.rows[0].total, 10);
      return {
        success: true,
        portfolios: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.error("Error in fetching active portfolios:", err.message);
      throw new Error("Failed to fetch active portfolios");
    }
  }
  

  // Get portfolio item by ID
  async getById(id) {
    try {
      const result = await this.db.query('SELECT * FROM portfolio_items WHERE portfolio_item_id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      console.error('Error fetching portfolio by ID:', err);
      throw err;
    }
  }

  // Create a new portfolio item
  async create(data) {
    try {
      const {
        title,
        category,
        description,
        image,
        problem,
        solution,
        results,
        tech_stack,
        active
      } = data;
  
      const fileName = `portfolio_${Date.now()}_${image.originalname}`;
  
      // Upload image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolios")
        .upload(fileName, image.buffer, { contentType: image.mimetype });
      if (uploadError) throw uploadError;
  
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("portfolios")
        .getPublicUrl(fileName);
  
      const imageUrl = publicUrlData.publicUrl;
  
      // Insert into DB
      const result = await this.db.query(
        `INSERT INTO portfolio_items
        (title, category, description, image, problem, solution, results, tech_stack, active)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
          title,
          category,
          description,
          imageUrl,
          problem,
          solution,
          results,
          JSON.stringify(tech_stack), // Store tech_stack as JSON
          active
        ]
      );
  
      return result.rows[0];
    } catch (err) {
      console.error('Error creating portfolio:', err);
      throw err;
    }
  }
  

  // Update a portfolio item
  async update(id, updateData) {
    console.log(updateData);
    try {
      const fields = [];
      const values = [];
      let idx = 1;

      for (const key in updateData) {
        if (key === 'tech_stack') {
          fields.push(`${key} = $${idx}`);
          values.push(JSON.stringify(updateData[key])); // Store as JSON
        } else {
          fields.push(`${key} = $${idx}`);
          values.push(updateData[key]);
        }
        idx++;
      }

      if (fields.length === 0) return null;

      const query = `UPDATE portfolio_items SET ${fields.join(', ')} WHERE portfolio_item_id = $${idx} RETURNING *`;
      values.push(id);

      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error updating portfolio:', err);
      throw err;
    }
  }
}

module.exports = PortfolioService;
