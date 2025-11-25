class CategoryService {
  constructor(db) {
    this.db = db;
  }

  
  async listCategories() {
    try {

      const result = await this.db.query(
        `SELECT * FROM categories 
        WHERE is_active = true
        ORDER BY name ASC`
      );

      const notNestedCategories = result.rows;

      return notNestedCategories;
    } catch (err) {
      console.error("Error in getting category list:", err.message);
      throw new Error("Failed to get category list");
    }
  }

  async listAllCategories() {
    try {

      const result = await this.db.query(
        `SELECT * FROM categories
        ORDER BY name ASC`
      );

      const notNestedCategories = result.rows;

      return notNestedCategories;
    } catch (err) {
      console.error("Error in getting category list:", err.message);
      throw new Error("Failed to get category list");
    }
  }


  async addCategory({name, slug, parent_id, is_featured, is_active}) {
    try {

      const result = await this.db.query(
        `INSERT INTO categories 
        (name, slug, parent_id, is_featured, is_active)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
        [
            
            name, 
            slug, 
            parent_id, 
            is_featured, 
            is_active
        ]
      );

      return result.rows[0];
    } catch (err) {
      console.error("Error in creating category:", err.message);
      throw new Error("Failed to create category");
    }
  }

  async getCategoryById(category_id) {
    try {
      const result = await this.db.query(`SELECT * FROM categories WHERE category_id = $1`, [category_id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting category by category_id:", err.message);
      throw new Error("Failed to get category by category_id");
    }
  }

  async isDescendant(childId, parentId) {
    const result = await this.db.query(
      `
      WITH RECURSIVE category_tree AS (
        SELECT category_id, parent_id
        FROM categories
        WHERE category_id = $1
        
        UNION ALL
        
        SELECT c.category_id, c.parent_id
        FROM categories c
        INNER JOIN category_tree ct ON ct.parent_id = c.category_id
      )
      SELECT * FROM category_tree WHERE category_id = $2;
      `,
      [parentId, childId]
    );
  
    return result.rows.length > 0;
  }
  


  async editCategory({category_id, name, slug, parent_id, is_featured, is_active}) {
    try {
      const result = await this.db.query(
        `UPDATE categories 
        SET 
        name = $1,
        slug = $2,
        is_featured = $3,
        is_active = $4,
        parent_id = $5
        WHERE category_id = $6
        RETURNING *`, 
        [
            name, 
            slug,
            is_featured,
            is_active,
            parent_id,
            category_id
        ]
    );
      return result.rows[0];
    } catch (err) {
      console.error("Error in editing category:", err.message);
      throw new Error("Failed to edit category");
    }
  }
  

}

module.exports = CategoryService;
