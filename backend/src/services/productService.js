// src/services/productService.js
class ProductService {
  constructor(db) {
    this.db = db;
  }

  // Create product + variants + images (transaction)
  async createProduct(data) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      const {
        name,
        slug,
        description = null,
        price,
        discount_price = null,
        is_active = true,
        category_id = null,
        variants = [],
        images = [] // array of image URLs
      } = data;

      // Insert product
      const insertProductQ = `
        INSERT INTO products
        (name, slug, description, price, discount_price, is_active, category_id, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *`;
      const productRes = await client.query(insertProductQ, [
        name, slug, description, price, discount_price, is_active, category_id
      ]);
      const product = productRes.rows[0];

      // Insert variants
      for (const v of variants) {
        const { size, color, sku} = v;
        await client.query(
          `INSERT INTO product_variants (size, color, sku, product_id, created_at, updated_at)
           VALUES ($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [size, color, sku, product.product_id]
        );
      }

      // Insert images
      for (const imgUrl of images) {
        await client.query(
          `INSERT INTO product_images (image_url, is_featured, product_id, created_at, updated_at)
           VALUES ($1,$2,$3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [imgUrl.url || imgUrl, imgUrl.is_featured || false, product.product_id]
        );
      }

      await client.query("COMMIT");
      return product;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("createProduct error:", err.message);
      throw err;
    } finally {
      client.release();
    }
  }

  // Get products with pagination & filters
  async getProducts(page = 1, limit = 12, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClauses = [];
      const params = [];
      let idx = 1;

      if (filters.search) {
        whereClauses.push(`(LOWER(name) LIKE $${idx} OR LOWER(description) LIKE $${idx})`);
        params.push(`%${String(filters.search).toLowerCase()}%`);
        idx++;
      }

      if (filters.category_id !== null && filters.category_id !== undefined) {
        whereClauses.push(`category_id = $${idx}`);
        params.push(filters.category_id);
        idx++;
      }

      if (filters.minPrice !== null && filters.minPrice !== undefined && !Number.isNaN(Number(filters.minPrice))) {
        whereClauses.push(`price >= $${idx}`);
        params.push(Number(filters.minPrice));
        idx++;
      }

      if (filters.maxPrice !== null && filters.maxPrice !== undefined && !Number.isNaN(Number(filters.maxPrice))) {
        whereClauses.push(`price <= $${idx}`);
        params.push(Number(filters.maxPrice));
        idx++;
      }

      if (filters.is_active !== null && filters.is_active !== undefined) {
        whereClauses.push(`is_active = $${idx}`);
        params.push(Boolean(filters.is_active));
        idx++;
      }

      const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

      const countQ = `SELECT COUNT(*)::int AS count FROM products ${whereSQL}`;

      let orderSQL = `ORDER BY product_id ASC`;
      if (filters.sort === "price_asc") orderSQL = `ORDER BY price ASC`;
      else if (filters.sort === "price_desc") orderSQL = `ORDER BY price DESC`;
      else if (filters.sort === "newest") orderSQL = `ORDER BY created_at DESC`;

      const selectQ = `
        SELECT * FROM products
        ${whereSQL}
        ${orderSQL}
        LIMIT $${idx} OFFSET $${idx + 1}
      `;
      params.push(limit, offset);

      const [productsRes, countRes] = await Promise.all([
        this.db.query(selectQ, params),
        this.db.query(countQ, params.slice(0, params.length - 2))
      ]);

      return {
        products: productsRes.rows,
        total: countRes.rows[0] ? parseInt(countRes.rows[0].count, 10) : 0
      };
    } catch (err) {
      console.error("getProducts error:", err.message);
      throw err;
    }
  }

  // Get product by ID (with variants, images, reviews)
  async getProductById(product_id) {
    try {
      const productRes = await this.db.query(`SELECT * FROM products WHERE product_id = $1`, [product_id]);
      const product = productRes.rows[0];
      if (!product) return null;

      const [variantsRes, imagesRes, reviewsRes] = await Promise.all([
        this.db.query(`SELECT * FROM product_variants WHERE product_id = $1 ORDER BY product_variant_id`, [product_id]),
        this.db.query(`SELECT * FROM product_images WHERE product_id = $1 ORDER BY product_image_id`, [product_id]),
        this.db.query(`SELECT * FROM product_reviews WHERE product_id = $1 ORDER BY product_review_id`, [product_id])
      ]);

      return {
        ...product,
        variants: variantsRes.rows,
        images: imagesRes.rows,
        reviews: reviewsRes.rows
      };
    } catch (err) {
      console.error("getProductById error:", err.message);
      throw err;
    }
  }

  // Update product
  async updateProduct(product_id, data) {
    try {
      const allowed = ["name", "slug", "description", "price", "discount_price", "is_active", "category_id"];
      const sets = [];
      const values = [];
      let idx = 1;

      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sets.push(`${key} = $${idx}`);
          values.push(data[key]);
          idx++;
        }
      }

      if (sets.length === 0) {
        const r = await this.db.query(`SELECT * FROM products WHERE product_id = $1`, [product_id]);
        return r.rows[0];
      }

      values.push(product_id);
      const q = `UPDATE products SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE product_id = $${idx} RETURNING *`;
      const res = await this.db.query(q, values);
      return res.rows[0];
    } catch (err) {
      console.error("updateProduct error:", err.message);
      throw err;
    }
  }

  // Delete product (with variants, images, reviews)
  async deleteProduct(product_id) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      await client.query(`DELETE FROM product_reviews WHERE product_id = $1`, [product_id]);
      await client.query(`DELETE FROM product_images WHERE product_id = $1`, [product_id]);
      await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [product_id]);

      const res = await client.query(`DELETE FROM products WHERE product_id = $1 RETURNING *`, [product_id]);

      await client.query("COMMIT");
      return res.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("deleteProduct error:", err.message);
      throw err;
    } finally {
      client.release();
    }
  }

  // Variants CRUD
  async createVariant(product_id, payload) {
    const { size, color, sku } = payload;
    const res = await this.db.query(
      `INSERT INTO product_variants (size, color, sku, product_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      [size, color, sku, product_id]
    );
    return res.rows[0];
  }

  async updateVariant(product_id, variant_id, payload) {
    const allowed = ["size", "color", "sku"];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        sets.push(`${key} = $${idx}`);
        values.push(payload[key]);
        idx++;
      }
    }

    if (sets.length === 0) {
      const r = await this.db.query(`SELECT * FROM product_variants WHERE product_variant_id = $1 AND product_id = $2`, [variant_id, product_id]);
      return r.rows[0];
    }

    values.push(variant_id, product_id);
    const q = `UPDATE product_variants SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE product_variant_id = $${idx} AND product_id = $${idx + 1} RETURNING *`;
    const res = await this.db.query(q, values);
    return res.rows[0];
  }

  async deleteVariant(product_id, variant_id) {
    const res = await this.db.query(
      `DELETE FROM product_variants WHERE product_variant_id = $1 AND product_id = $2 RETURNING *`,
      [variant_id, product_id]
    );
    return res.rows[0];
  }

  // Images CRUD
  async addProductImages(product_id, imageUrls = []) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      const inserted = [];
      for (const u of imageUrls) {
        const image_url = (typeof u === "string") ? u : u.url;
        const is_featured = (typeof u === "object" && u.is_featured) ? true : false;
        const res = await client.query(
          `INSERT INTO product_images (image_url, is_featured, product_id, created_at, updated_at)
           VALUES ($1,$2,$3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
          [image_url, is_featured, product_id]
        );
        inserted.push(res.rows[0]);
      }
      await client.query("COMMIT");
      return inserted;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("addProductImages error:", err.message);
      throw err;
    } finally {
      client.release();
    }
  }

  async updateImage(product_id, image_id, payload) {
    const allowed = ["image_url", "is_featured"];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        sets.push(`${key} = $${idx}`);
        values.push(payload[key]);
        idx++;
      }
    }

    if (sets.length === 0) {
      const r = await this.db.query(`SELECT * FROM product_images WHERE product_image_id = $1 AND product_id = $2`, [image_id, product_id]);
      return r.rows[0];
    }

    values.push(image_id, product_id);
    const q = `UPDATE product_images SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE product_image_id = $${idx} AND product_id = $${idx + 1} RETURNING *`;
    const res = await this.db.query(q, values);
    return res.rows[0];
  }

  async deleteImage(product_id, image_id) {
    const res = await this.db.query(
      `DELETE FROM product_images WHERE product_image_id = $1 AND product_id = $2 RETURNING *`,
      [image_id, product_id]
    );
    return res.rows[0];
  }

  // Reviews CRUD
  async createReview(product_id, payload) {
    const { rating, comment = "", user_id } = payload;
    const res = await this.db.query(
      `INSERT INTO product_reviews (rating, comment, user_id, product_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      [rating, comment, user_id, product_id]
    );
    return res.rows[0];
  }

  async updateReview(product_id, review_id, payload) {
    const allowed = ["rating", "comment"];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        sets.push(`${key} = $${idx}`);
        values.push(payload[key]);
        idx++;
      }
    }

    if (sets.length === 0) {
      const r = await this.db.query(`SELECT * FROM product_reviews WHERE product_review_id = $1 AND product_id = $2`, [review_id, product_id]);
      return r.rows[0];
    }

    values.push(review_id, product_id);
    const q = `UPDATE product_reviews SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE product_review_id = $${idx} AND product_id = $${idx + 1} RETURNING *`;
    const res = await this.db.query(q, values);
    return res.rows[0];
  }

  async deleteReview(product_id, review_id) {
    const res = await this.db.query(
      `DELETE FROM product_reviews WHERE product_review_id = $1 AND product_id = $2 RETURNING *`,
      [review_id, product_id]
    );
    return res.rows[0];
  }
}

module.exports = ProductService;
