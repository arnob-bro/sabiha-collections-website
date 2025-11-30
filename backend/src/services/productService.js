const { cloudinary, uploadBuffer } = require("../config/cloudinary");

class ProductService {
  constructor(db) {
    this.db = db;
  }

  // ---------------------------
  // Create product + variants + sizes + images
  // ---------------------------
  async createProduct(data) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      const {
        name,
        slug,
        description,
        price,
        discount_price,
        is_active = true,
        category_id = null,
        variants = [],
        files = {},
      } = data;

      // Insert product
      const productRes = await client.query(
        `INSERT INTO products
         (name, slug, description, price, discount_price, is_active, category_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [name, slug, description, price, discount_price, is_active, category_id]
      );
      const product = productRes.rows[0];

      // Loop variants
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const { color, sku, is_featured = false, sizes = [] } = v;

        // Insert variant
        const variantRes = await client.query(
          `INSERT INTO product_variants (color, sku, product_id, is_featured)
           VALUES ($1,$2,$3,$4) RETURNING *`,
          [color, sku, product.product_id, is_featured]
        );
        const variant = variantRes.rows[0];

        // Insert sizes
        for (const s of sizes) {
          await client.query(
            `INSERT INTO product_variant_sizes (product_variant_id, size)
             VALUES ($1,$2)`,
            [variant.product_variant_id, s]
          );
        }

        // Upload images if files exist
        const variantFiles = files[`variant_${i}_images`] || [];
        for (const file of variantFiles) {
          const uploaded = await uploadBuffer(file.buffer, {
            folder: process.env.CLOUDINARY_FOLDER || "products",
            resource_type: "image",
            use_filename: true,
            unique_filename: true,
            overwrite: false,
          });

          await client.query(
            `INSERT INTO product_images (image_url, public_id, product_variant_id, is_featured_one, is_featured_two)
             VALUES ($1,$2,$3,false,false)`,
            [
              uploaded.secure_url,
              uploaded.public_id,
              variant.product_variant_id,
            ]
          );
        }
      }

      await client.query("COMMIT");
      return product;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  // ---------------------------
  // Get products with variants, sizes, images
  // ---------------------------
  async getProducts(page = 1, limit = 12, filters = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    let idx = 1;

    let query = `SELECT * FROM products WHERE 1=1`;

    if (filters.search) {
      query += ` AND name ILIKE $${idx}`;
      params.push(`%${filters.search}%`);
      idx++;
    }
    if (filters.category_id) {
      query += ` AND category_id = $${idx}`;
      params.push(filters.category_id);
      idx++;
    }
    if (filters.minPrice !== null) {
      query += ` AND price >= $${idx}`;
      params.push(filters.minPrice);
      idx++;
    }
    if (filters.maxPrice !== null) {
      query += ` AND price <= $${idx}`;
      params.push(filters.maxPrice);
      idx++;
    }
    if (filters.is_active !== null) {
      query += ` AND is_active = $${idx}`;
      params.push(filters.is_active);
      idx++;
    }

    const countQuery = `SELECT COUNT(*) FROM (${query}) AS count_table`;
    const countResult = await this.db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    query += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(limit, offset);

    const { rows } = await this.db.query(query, params);

    const products = await Promise.all(
      rows.map(async (product) => {
        const variantsRes = await this.db.query(
          `SELECT pv.*, 
          COALESCE(json_agg(DISTINCT pvs.size::text) FILTER (WHERE pvs.size IS NOT NULL), '[]'::json) AS sizes,
          COALESCE(
            json_agg(DISTINCT (
            json_build_object(
              'product_image_id', pi.product_image_id,
              'image_url', pi.image_url,
              'public_id', pi.public_id,
              'is_featured_one', pi.is_featured_one,
              'is_featured_two', pi.is_featured_two
            )
      )::jsonb
              ) FILTER (WHERE pi.product_variant_id IS NOT NULL)::json,
            '[]'::json
          ) AS images
        FROM product_variants pv
        LEFT JOIN product_variant_sizes pvs ON pv.product_variant_id = pvs.product_variant_id
        LEFT JOIN product_images pi ON pv.product_variant_id = pi.product_variant_id
        WHERE pv.product_id = $1
        GROUP BY pv.product_variant_id`,
          [product.product_id]
        );
        return { ...product, variants: variantsRes.rows };
      })
    );

    return { total, products };
  }

  async getProductById(product_id) {
    // Fetch main product data
    const productRes = await this.db.query(
      `SELECT * FROM products WHERE product_id = $1`,
      [product_id]
    );
    if (productRes.rows.length === 0) return null;

    const product = productRes.rows[0];

    // Fetch variants, sizes, and images
    const variantsRes = await this.db.query(
      `SELECT pv.*,
        COALESCE(json_agg(DISTINCT pvs.size::text) FILTER (WHERE pvs.size IS NOT NULL), '[]'::json) AS sizes,

        COALESCE(
          json_agg(
            DISTINCT(
              json_build_object(
                'product_image_id', pi.product_image_id,
                'image_url', pi.image_url,
                'public_id', pi.public_id,
                'is_featured_one', pi.is_featured_one,
                'is_featured_two', pi.is_featured_two
              )
  )::jsonb
          ) FILTER (WHERE pi.product_variant_id IS NOT NULL)::json,
          '[]'::json
        ) AS images

     FROM product_variants pv
     LEFT JOIN product_variant_sizes pvs 
        ON pv.product_variant_id = pvs.product_variant_id
     LEFT JOIN product_images pi 
        ON pv.product_variant_id = pi.product_variant_id
     WHERE pv.product_id = $1
     GROUP BY pv.product_variant_id`,
      [product_id]
    );

    return {
      ...product,
      variants: variantsRes.rows,
    };
  }

  // ---------------------------
  // Variant CRUD
  // ---------------------------
  async createVariant(
    product_id,
    { color, sku, sizes = [], is_featured = false }
  ) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      const variantRes = await client.query(
        `INSERT INTO product_variants (color, sku, product_id, is_featured)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [color, sku, product_id, is_featured]
      );
      const variant = variantRes.rows[0];

      for (const s of sizes) {
        await client.query(
          `INSERT INTO product_variant_sizes (product_variant_id, size)
           VALUES ($1,$2)`,
          [variant.product_variant_id, s]
        );
      }

      const sizesRes = await client.query(
        `SELECT size FROM product_variant_sizes WHERE product_variant_id = $1`,
        [variant.product_variant_id]
      );

      await client.query("COMMIT");

      return { ...variant, sizes: sizesRes.rows.map((r) => r.size) };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async updateVariant(product_id, variant_id, payload) {
    const allowed = ["color", "sku", "is_featured"];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (payload[key] !== undefined) {
        sets.push(`${key} = $${idx}`);
        values.push(payload[key]);
        idx++;
      }
    }

    if (sets.length === 0) {
      const r = await this.db.query(
        `SELECT * FROM product_variants WHERE product_variant_id = $1 AND product_id = $2`,
        [variant_id, product_id]
      );
      return r.rows[0];
    }

    values.push(variant_id, product_id);
    const q = `UPDATE product_variants SET ${sets.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP
               WHERE product_variant_id = $${idx} AND product_id = $${
      idx + 1
    } RETURNING *`;
    const res = await this.db.query(q, values);
    return res.rows[0];
  }

  async deleteVariant(product_id, variant_id) {
  const client = await this.db.connect();
  try {
    await client.query("BEGIN");

    // Fetch images for this variant
    const imagesRes = await client.query(
      `SELECT public_id FROM product_images WHERE product_variant_id = $1`,
      [variant_id]
    );

    // Delete Cloudinary images
    for (const img of imagesRes.rows) {
      if (img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id, {
            resource_type: "image",
          });
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
    }

    // Delete images from DB
    await client.query(
      `DELETE FROM product_images WHERE product_variant_id = $1`,
      [variant_id]
    );

    // Delete sizes
    await client.query(
      `DELETE FROM product_variant_sizes WHERE product_variant_id = $1`,
      [variant_id]
    );

    // Delete variant
    const deleteVariantRes = await client.query(
      `DELETE FROM product_variants WHERE product_variant_id = $1 AND product_id = $2 RETURNING *`,
      [variant_id, product_id]
    );

    await client.query("COMMIT");
    return deleteVariantRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


  // ---------------------------
  // Images CRUD
  // ---------------------------
  async addProductImages(variant_id, images = []) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      const inserted = [];

      for (const img of images) {
        const url = img.image_url;
        const public_id = img.public_id;
        const is_featured_one = img.is_featured_one || false;
        const is_featured_two = img.is_featured_two || false;

        const res = await client.query(
          `INSERT INTO product_images (product_variant_id, image_url, public_id, is_featured_one, is_featured_two, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) RETURNING *`,
          [variant_id, url, public_id, is_featured_one, is_featured_two]
        );
        inserted.push(res.rows[0]);
      }

      await client.query("COMMIT");
      return inserted;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async updateImage(variant_id, image_id, payload, newFile) {
  // Fetch existing image first
  const existingRes = await this.db.query(
    `SELECT * FROM product_images WHERE product_image_id = $1 AND product_variant_id = $2`,
    [image_id, variant_id]
  );
  const existingImage = existingRes.rows[0];
  if (!existingImage) return null;

  let newUrl = payload.image_url || existingImage.image_url;
  let newPublicId = payload.public_id || existingImage.public_id;

  // If new file is uploaded, upload it and delete old from Cloudinary
  if (newFile) {
    // Upload new file
    const uploaded = await uploadBuffer(newFile.buffer, {
      folder: process.env.CLOUDINARY_FOLDER || "products",
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    newUrl = uploaded.secure_url;
    newPublicId = uploaded.public_id;

    // Delete previous image from Cloudinary
    if (existingImage.public_id) {
      try {
        await cloudinary.uploader.destroy(existingImage.public_id, {
          resource_type: "image",
        });
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }
  }

  // Prepare payload for DB update
  const allowed = ["image_url", "public_id", "is_featured_one", "is_featured_two"];
  const sets = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (key === "image_url") {
      sets.push(`${key} = $${idx}`);
      values.push(newUrl);
      idx++;
    } else if (key === "public_id") {
      sets.push(`${key} = $${idx}`);
      values.push(newPublicId);
      idx++;
    } else if (payload[key] !== undefined) {
      sets.push(`${key} = $${idx}`);
      values.push(payload[key]);
      idx++;
    }
  }

  values.push(image_id, variant_id);
  const q = `UPDATE product_images SET ${sets.join(
    ", "
  )}, updated_at = CURRENT_TIMESTAMP WHERE product_image_id = $${idx} AND product_variant_id = $${
    idx + 1
  } RETURNING *`;

  const updatedRes = await this.db.query(q, values);
  return updatedRes.rows[0];
}


  async deleteImage(variant_id, image_id) {
    // Fetch first to get public_id
    const resFetch = await this.db.query(
      `SELECT * FROM product_images WHERE product_image_id = $1 AND product_variant_id = $2`,
      [image_id, variant_id]
    );
    const image = resFetch.rows[0];
    if (!image) return null;

    // Delete from Cloudinary
    if (image.public_id) {
      try {
        await cloudinary.uploader.destroy(image.public_id, {
          resource_type: "image",
        });
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    // Delete from DB
    const resDelete = await this.db.query(
      `DELETE FROM product_images WHERE product_image_id = $1 AND product_variant_id = $2 RETURNING *`,
      [image_id, variant_id]
    );
    return resDelete.rows[0];
  }

  // ---------------------------
  // Product CRUD
  // ---------------------------
  async updateProduct(product_id, data) {
    const allowed = [
      "name",
      "slug",
      "description",
      "price",
      "discount_price",
      "is_active",
      "category_id",
    ];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (data[key] !== undefined) {
        sets.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }

    if (sets.length === 0) {
      const r = await this.db.query(
        `SELECT * FROM products WHERE product_id = $1`,
        [product_id]
      );
      return r.rows[0];
    }

    values.push(product_id);
    const q = `UPDATE products SET ${sets.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP WHERE product_id = $${idx} RETURNING *`;
    const res = await this.db.query(q, values);
    return res.rows[0];
  }

  async deleteProduct(product_id) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");

      // Delete reviews
      await client.query(`DELETE FROM product_reviews WHERE product_id = $1`, [
        product_id,
      ]);

      // Delete images from Cloudinary first
      const imagesRes = await client.query(
        `
        SELECT public_id FROM product_images 
        WHERE product_variant_id IN (
          SELECT product_variant_id FROM product_variants WHERE product_id = $1
        )`,
        [product_id]
      );

      for (const img of imagesRes.rows) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id, {
              resource_type: "image",
            });
          } catch (err) {
            console.error("Cloudinary delete error:", err);
          }
        }
      }

      // Delete images from DB
      await client.query(
        `DELETE FROM product_images WHERE product_variant_id IN (
        SELECT product_variant_id FROM product_variants WHERE product_id = $1
      )`,
        [product_id]
      );

      // Delete variant sizes
      await client.query(
        `DELETE FROM product_variant_sizes WHERE product_variant_id IN (
        SELECT product_variant_id FROM product_variants WHERE product_id = $1
      )`,
        [product_id]
      );

      // Delete variants
      await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [
        product_id,
      ]);

      // Delete product
      const res = await client.query(
        `DELETE FROM products WHERE product_id = $1 RETURNING *`,
        [product_id]
      );

      await client.query("COMMIT");
      return res.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  // ---------------------------
  // Reviews CRUD
  // ---------------------------
  async createReview(product_id, { rating, comment = "", user_id }) {
    const res = await this.db.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at, updated_at)
       VALUES ($1,$2,$3,$4,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) RETURNING *`,
      [product_id, user_id, rating, comment]
    );
    return res.rows[0];
  }

  async updateReview(product_id, review_id, payload) {
    const allowed = ["rating", "comment"];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (payload[key] !== undefined) {
        sets.push(`${key} = $${idx}`);
        values.push(payload[key]);
        idx++;
      }
    }

    if (sets.length === 0) {
      const r = await this.db.query(
        `SELECT * FROM product_reviews WHERE product_review_id = $1 AND product_id = $2`,
        [review_id, product_id]
      );
      return r.rows[0];
    }

    values.push(review_id, product_id);
    const q = `UPDATE product_reviews SET ${sets.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP
               WHERE product_review_id = $${idx} AND product_id = $${
      idx + 1
    } RETURNING *`;
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
