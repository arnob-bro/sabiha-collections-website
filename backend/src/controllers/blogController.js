const supabase = require("../config/supabaseClient.js")
class BlogController {
    constructor(blogService) {
        this.blogService = blogService;

        this.getAllBlogs = this.getAllBlogs.bind(this);
        this.getBlogById = this.getBlogById.bind(this);
        this.createBlog = this.createBlog.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
    }

    async getAllBlogs(req, res) {
        try {
            const { page, limit, title, active } = req.query;
            const result = await this.blogService.getBlogs(page, limit, title, active);
            return res.json({success: true, data: result });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getBlogById(req, res) {
        try {
            const { blog_id } = req.params;
            const blog = await this.blogService.getById(blog_id);
            if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
            return res.json({ success: true, blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async createBlog(req, res) {
        try {
            const {
                title,
                category,
                excerpt,
                content,
                read_time,
                author_name,
                author_role,
                active
            } = req.body;
            const imageFile = req.files?.image ? req.files.image[0] : null;
            const author_avatar = req.files?.author_avatar ? req.files.author_avatar[0] : null;

            // Validation
            if (!title || typeof title !== 'string' || title.trim().length < 3) {
                return res.status(400).json({ success: false, message: 'Title is required and must be at least 3 characters' });
            }
            if (!category || typeof category !== 'string' || category.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Category is required' });
            }
            if (!excerpt || typeof excerpt !== 'string' || excerpt.trim().length < 10) {
                return res.status(400).json({ success: false, message: 'Excerpt is required and must be at least 10 characters' });
            }
            if (!content || typeof content !== 'string' || content.trim().length < 20) {
                return res.status(400).json({ success: false, message: 'Content is required and must be at least 20 characters' });
            }
            if (!author_name || typeof author_name !== 'string' || author_name.trim().length < 2) {
                return res.status(400).json({ success: false, message: 'Author name is required and must be at least 2 characters' });
            }

            // Optional fields validation
            if (read_time && typeof read_time !== 'string') {
                return res.status(400).json({ success: false, message: 'Read time must be a string (e.g., "5 min read")' });
            }
            if (!imageFile) {
                return res.status(400).json({ success: false, message: 'Image must be a provided' });
            }
            if (!author_avatar ) {
                return res.status(400).json({ success: false, message: 'Author avatar must be provided' });
            }
            if (author_role && typeof author_role !== 'string') {
                return res.status(400).json({ success: false, message: 'Author role must be a string' });
            }

            const blog = await this.blogService.create({
                title: title.trim(),
                category: category.trim(),
                excerpt: excerpt.trim(),
                content: content.trim(),
                image: imageFile,
                read_time: read_time ? read_time.trim() : '5 min read',
                author_name: author_name.trim(),
                author_avatar: author_avatar,
                author_role: author_role ? author_role.trim() : null,
                active: active ?? true
            });

            return res.status(201).json({ success: true, blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async updateBlog(req, res) {
        try {
          const { blog_id } = req.params;
          const updateData = {};
          const {
            title,
            category,
            excerpt,
            content,
            read_time,
            author_name,
            author_role,
            active
          } = req.body;
      
          const imageFile = req.files?.image ? req.files.image[0] : null;
          const avatarFile = req.files?.author_avatar ? req.files.author_avatar[0] : null;
      
          // Text validations (unchanged)
          if (title !== undefined) {
            if (typeof title !== 'string' || title.trim().length < 3) {
              return res.status(400).json({ success: false, message: 'Title must be at least 3 characters' });
            }
            updateData.title = title.trim();
          }
      
          if (category !== undefined) {
            if (typeof category !== 'string' || category.trim().length === 0) {
              return res.status(400).json({ success: false, message: 'Category must be a non-empty string' });
            }
            updateData.category = category.trim();
          }
      
          if (excerpt !== undefined) {
            if (typeof excerpt !== 'string' || excerpt.trim().length < 10) {
              return res.status(400).json({ success: false, message: 'Excerpt must be at least 10 characters' });
            }
            updateData.excerpt = excerpt.trim();
          }
      
          if (content !== undefined) {
            if (typeof content !== 'string' || content.trim().length < 20) {
              return res.status(400).json({ success: false, message: 'Content must be at least 20 characters' });
            }
            updateData.content = content.trim();
          }
      
          if (author_name !== undefined) {
            if (typeof author_name !== 'string' || author_name.trim().length < 2) {
              return res.status(400).json({ success: false, message: 'Author name must be at least 2 characters' });
            }
            updateData.author_name = author_name.trim();
          }
      
          if (read_time !== undefined) {
            if (typeof read_time !== 'string') {
              return res.status(400).json({ success: false, message: 'Read time must be a string' });
            }
            updateData.read_time = read_time.trim();
          }
      
          if (author_role !== undefined) {
            if (author_role && typeof author_role !== 'string') {
              return res.status(400).json({ success: false, message: 'Author role must be a string' });
            }
            updateData.author_role = author_role ? author_role.trim() : null;
          }
      
          if (active !== undefined) {
            updateData.active = active;
          }
      
          // ✅ Handle Supabase uploads if new files provided
          if (imageFile) {
            const imageFileName = `blog_${Date.now()}_${imageFile.originalname}`;
            const { error: imgErr } = await supabase.storage
              .from("blogs")
              .upload(imageFileName, imageFile.buffer, { contentType: imageFile.mimetype });
            if (imgErr) throw imgErr;
      
            const { data: imgUrlData } = supabase.storage
              .from("blogs")
              .getPublicUrl(imageFileName);
            updateData.image = imgUrlData.publicUrl;
          }
      
          if (avatarFile) {
            const avatarFileName = `avatar_${Date.now()}_${avatarFile.originalname}`;
            const { error: avErr } = await supabase.storage
              .from("avatars")
              .upload(avatarFileName, avatarFile.buffer, { contentType: avatarFile.mimetype });
            if (avErr) throw avErr;
      
            const { data: avUrlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(avatarFileName);
            updateData.author_avatar = avUrlData.publicUrl;
          }
      
          const updated = await this.blogService.update(blog_id, updateData);
          if (!updated) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
          }
      
          return res.json({ success: true, blog: updated });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
      

    async toggleActive(req, res) {
        try {
            const { blog_id } = req.params;
            const blog = await this.blogService.toggleActive(blog_id);
            if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
            return res.json({ success: true, blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = BlogController;
