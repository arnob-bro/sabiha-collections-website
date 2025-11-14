const supabase = require("../config/supabaseClient.js")
class BlogService {
    constructor(db) {
        this.db = db; // injected pg pool
    }

    async getBlogs( page , limit , title, active ) {
        try {
          const offset = (page - 1) * limit;
      
          // Build dynamic WHERE clause
          const conditions = [];
          const values = [];
      
          if (title) {
            values.push(`%${title}%`);
            conditions.push(`title ILIKE $${values.length}`);
          }
          if (active) {
            values.push(active);
            conditions.push(`active = $${values.length}`);
          }
          
      
          const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      
          // Fetch paginated results
          const result = await this.db.query(
            `SELECT * FROM blogs ${whereClause} ORDER BY date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
            [...values, limit, offset]
          );
      
          // Get total count for pagination
          const countResult = await this.db.query(
            `SELECT COUNT(*) FROM blogs ${whereClause}`,
            values
          );
          const total = parseInt(countResult.rows[0].count, 10);
          const totalPages = Math.ceil(total / limit);
      
          return {
            blogs: result.rows,
            pagination: {
              page: page,
              limit,
              total,
              totalPages
            }
          };
        } catch (err) {
          console.error("Error in fetching blogs:", err.message);
          throw new Error("Failed to fetch blogs");
        }
      }


    async getById(blog_id) {
        try {
            const res = await this.db.query('SELECT * FROM blogs WHERE blog_id = $1', [blog_id]);
            return res.rows[0];
        } catch (err) {
            console.error(`Error fetching blog with id ${blog_id}:`, err.message);
            throw err;
        }
    }

    async create(data) {
        try {

            const {
                title, category, excerpt, content, image, 
                read_time, author_name, author_avatar,
                author_role, active
            } = data;

            // Image upload
            const imageFileName = `blog_${Date.now()}_${image.originalname}`;
            const { data: imageUploadData, error: imageError } = await supabase.storage
            .from("blogs")
            .upload(imageFileName, image.buffer, { contentType: image.mimetype });

            if (imageError) throw imageError;

            const { data: imagePublicUrlData } = supabase.storage
            .from("blogs")
            .getPublicUrl(imageFileName);

            const imageUrl = imagePublicUrlData.publicUrl;

            // Avatar upload
            const avatarFileName = `avatar_${Date.now()}_${author_avatar.originalname}`;
            const { data: avatarUploadData, error: avatarError } = await supabase.storage
            .from("avatars")
            .upload(avatarFileName, author_avatar.buffer, { contentType: author_avatar.mimetype });

            if (avatarError) throw avatarError;

            const { data: avatarPublicUrlData } = supabase.storage
            .from("avatars") // ✅ FIXED (was blogs before)
            .getPublicUrl(avatarFileName);

            const avatarUrl = avatarPublicUrlData.publicUrl;


            const res = await this.db.query(
                `INSERT INTO blogs
                (title, category, excerpt, content, image, read_time, author_name, author_avatar, author_role, active)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
                [title, category, excerpt, content, imageUrl, read_time, author_name, avatarUrl, author_role, active]
            );
            return res.rows[0];
        } catch (err) {
            console.error("Error creating blog:", err.message);
            throw err;
        }
    }

    async update(blog_id, data) {
        try {
            const fields = [];
            const values = [];
            let i = 1;

            for (let key in data) {
                fields.push(`${key}=$${i}`);
                values.push(data[key]);
                i++;
            }

            if (fields.length === 0) return null;

            const res = await this.db.query(
                `UPDATE blogs SET ${fields.join(', ')}, updated_at=NOW() WHERE blog_id=$${i} RETURNING *`,
                [...values, blog_id]
            );
            return res.rows[0];
        } catch (err) {
            console.error(`Error updating blog with id ${blog_id}:`, err.message);
            throw err;
        }
    }

    async delete(blog_id) {
        try {
            const res = await this.db.query('DELETE FROM blogs WHERE blog_id=$1 RETURNING *', [blog_id]);
            return res.rows[0];
        } catch (err) {
            console.error(`Error deleting blog with id ${blog_id}:`, err.message);
            throw err;
        }
    }

    async toggleActive(blog_id) {
        try {
            const blog = await this.getById(blog_id);
            if (!blog) return null;

            const res = await this.db.query(
                'UPDATE blogs SET active = NOT active, updated_at=NOW() WHERE blog_id=$1 RETURNING *',
                [blog_id]
            );
            return res.rows[0];
        } catch (err) {
            console.error(`Error toggling active state for blog with id ${blog_id}:`, err.message);
            throw err;
        }
    }
}

module.exports = BlogService;
