const { uploadBuffer, cloudinary } = require("../config/cloudinary");

class ProductController {
  constructor(productService) {
    this.productService = productService;

    // Bind all methods
    this.createProduct = this.createProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);

    this.createVariant = this.createVariant.bind(this);
    this.updateVariant = this.updateVariant.bind(this);
    this.deleteVariant = this.deleteVariant.bind(this);

    this.uploadImages = this.uploadImages.bind(this);
    this.createImage = this.createImage.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);

    this.createReview = this.createReview.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }

  // ----------------------------
  // Products
  // ----------------------------
  async createProduct(req, res) {
    try {
      const {
        name, slug, description = null, price,
        discount_price = null, is_active = true, category_id = null,
        variants = "[]"
      } = req.body;

      if (!name || !slug || price === undefined) {
        return res.status(400).json({ error: "name, slug, and price are required" });
      }

      let parsedVariants = variants;
      if (typeof variants === "string") parsedVariants = JSON.parse(variants);

      const files = req.files || {};

      const product = await this.productService.createProduct({
        name,
        slug,
        description,
        price: Number(price),
        discount_price: discount_price ? Number(discount_price) : null,
        is_active: is_active === "false" ? false : Boolean(is_active),
        category_id,
        variants: parsedVariants,
        files,
      });

      res.status(201).json({ success: true, product });
    } catch (err) {
      console.error("createProduct error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async getProducts(req, res) {
    try {
      let { page = 1, limit = 12, search, category_id, minPrice, maxPrice, is_active } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 12;

      const filters = {
        search: search ? String(search).trim() : null,
        category_id: category_id || null,
        minPrice: minPrice !== undefined ? Number(minPrice) : null,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : null,
        is_active:
          is_active !== undefined ? (is_active === "true" || is_active === "1") : null
      };

      const data = await this.productService.getProducts(page, limit, filters);

      res.json({
        success: true,
        pagination: {
          page,
          limit,
          total: data.total,
          totalPages: Math.ceil(data.total / limit)
        },
        products: data.products
      });
    } catch (err) {
      console.error("getProducts error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async getProductById(req, res) {
    try {
      const { product_id } = req.params;
      const product = await this.productService.getProductById(product_id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json({ success: true, product });
    } catch (err) {
      console.error("getProductById error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async updateProduct(req, res) {
    try {
      const { product_id } = req.params;
      const payload = req.body;

      if (payload.price !== undefined && isNaN(Number(payload.price)))
        return res.status(400).json({ error: "price must be numeric" });

      const updated = await this.productService.updateProduct(product_id, payload);
      if (!updated) return res.status(404).json({ error: "Product not found" });
      res.json({ success: true, product: updated });
    } catch (err) {
      console.error("updateProduct error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { product_id } = req.params;
      const deleted = await this.productService.deleteProduct(product_id);
      if (!deleted) return res.status(404).json({ error: "Product not found" });
      res.json({ success: true, message: "Product deleted" });
    } catch (err) {
      console.error("deleteProduct error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  // ----------------------------
  // Variants
  // ----------------------------
  async createVariant(req, res) {
    try {
      const { product_id } = req.params;
      const { color, sku, sizes = [], is_featured = false } = req.body;
      if (!color || !sku) return res.status(400).json({ error: "color and sku are required" });

      const variant = await this.productService.createVariant(product_id, { color, sku, sizes, is_featured });
      res.status(201).json({ success: true, variant });
    } catch (err) {
      console.error("createVariant error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async updateVariant(req, res) {
    try {
      const { product_id, variant_id } = req.params;
      const payload = req.body;
      const updated = await this.productService.updateVariant(product_id, variant_id, payload);
      if (!updated) return res.status(404).json({ error: "Variant not found" });
      res.json({ success: true, variant: updated });
    } catch (err) {
      console.error("updateVariant error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async deleteVariant(req, res) {
    try {
      const { product_id, variant_id } = req.params;
      const deleted = await this.productService.deleteVariant(product_id, variant_id);
      if (!deleted) return res.status(404).json({ error: "Variant not found" });
      res.json({ success: true, message: "Variant deleted" });
    } catch (err) {
      console.error("deleteVariant error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  // ----------------------------
  // Images
  // ----------------------------
  async uploadImages(req, res) {
    try {
      const { variant_id } = req.params;
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: "No images uploaded" });

      const uploadPromises = req.files.map(file => {
        return uploadBuffer(file.buffer, {
          folder: process.env.CLOUDINARY_FOLDER || "products",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
          overwrite: false
        });
      });

      const uploadedResults = await Promise.all(uploadPromises);
      const imagesToSave = uploadedResults.map(r => ({
        image_url: r.secure_url,
        public_id: r.public_id,
        is_featured_one: false,
        is_featured_two: false
      }));

      const saved = await this.productService.addProductImages(variant_id, imagesToSave);
      res.status(201).json({ success: true, images: saved });
    } catch (err) {
      console.error("uploadImages error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async createImage(req, res) {
    try {
      const { variant_id } = req.params;
      const { image_url, public_id = null, is_featured_one = false, is_featured_two = false } = req.body;
      if (!image_url) return res.status(400).json({ error: "image_url required" });

      const saved = await this.productService.addProductImages(variant_id, [{ image_url, public_id, is_featured_one, is_featured_two }]);
      res.status(201).json({ success: true, image: saved[0] });
    } catch (err) {
      console.error("createImage error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async updateImage(req, res) {
  try {
    const { variant_id, image_id } = req.params;
    const { is_featured_one, is_featured_two } = req.body;
    const file = req.file; // If a new image file is uploaded

    // Prepare payload
    const payload = {};
    if (is_featured_one !== undefined) payload.is_featured_one = is_featured_one;
    if (is_featured_two !== undefined) payload.is_featured_two = is_featured_two;

    // If no new file and no featured flags, must provide image_url
    if (!file && !payload.is_featured_one && !payload.is_featured_two && !req.body.image_url) {
      return res.status(400).json({ error: "Provide a new file, image_url, or featured flags" });
    }

    if (req.body.image_url) {
      payload.image_url = req.body.image_url;
    }

    // Call service to update image
    const updated = await this.productService.updateImage(
      variant_id,
      image_id,
      payload,
      file // pass uploaded file buffer if any
    );

    if (!updated) return res.status(404).json({ error: "Image not found" });

    res.json({ success: true, image: updated });
  } catch (err) {
    console.error("updateImage error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}


  async deleteImage(req, res) {
    try {
      const { variant_id, image_id } = req.params;
      const deleted = await this.productService.deleteImage(variant_id, image_id);
      if (!deleted) return res.status(404).json({ error: "Image not found" });
      res.json({ success: true, message: "Image deleted" });
    } catch (err) {
      console.error("deleteImage error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  // ----------------------------
  // Reviews
  // ----------------------------
  async createReview(req, res) {
    try {
      const { product_id } = req.params;
      const { rating, comment = "", user_id } = req.body;
      if (!user_id) return res.status(400).json({ error: "user_id required" });
      if (rating === undefined || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5)
        return res.status(400).json({ error: "rating must be 1-5" });

      const review = await this.productService.createReview(product_id, { rating: Number(rating), comment, user_id });
      res.status(201).json({ success: true, review });
    } catch (err) {
      console.error("createReview error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async updateReview(req, res) {
    try {
      const { product_id, review_id } = req.params;
      const payload = req.body;
      if (payload.rating !== undefined) {
        const r = Number(payload.rating);
        if (isNaN(r) || r < 1 || r > 5) return res.status(400).json({ error: "rating must be 1-5" });
      }
      const updated = await this.productService.updateReview(product_id, review_id, payload);
      if (!updated) return res.status(404).json({ error: "Review not found" });
      res.json({ success: true, review: updated });
    } catch (err) {
      console.error("updateReview error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async deleteReview(req, res) {
    try {
      const { product_id, review_id } = req.params;
      const deleted = await this.productService.deleteReview(product_id, review_id);
      if (!deleted) return res.status(404).json({ error: "Review not found" });
      res.json({ success: true, message: "Review deleted" });
    } catch (err) {
      console.error("deleteReview error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
}

module.exports = ProductController;
