// src/controllers/productController.js
const { cloudinary ,uploadBuffer } = require("../config/cloudinary");

class ProductController {
  constructor(productService) {
    this.productService = productService;

    // bind methods
    this.createProduct = this.createProduct.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);

    // variants
    this.createVariant = this.createVariant.bind(this);
    this.updateVariant = this.updateVariant.bind(this);
    this.deleteVariant = this.deleteVariant.bind(this);

    // images
    this.uploadImages = this.uploadImages.bind(this); // accepts multipart form-data files
    this.createImage = this.createImage.bind(this);   // add single image by url
    this.updateImage = this.updateImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);

    // reviews
    this.createReview = this.createReview.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }

  // product handlers (same as earlier) ...
  async createProduct(req, res) {
    try {
      const {
        name, slug, description = null, price,
        discount_price = null, is_active = true, category_id = null,
        variants = [], images = [] // images here are URLs (optional)
      } = req.body;

      if (!name || typeof name !== "string") return res.status(400).json({ error: "name is required" });
      if (!slug || typeof slug !== "string") return res.status(400).json({ error: "slug is required" });
      if (price === undefined || isNaN(Number(price))) return res.status(400).json({ error: "price is required and numeric" });

      // if variants/images are supplied as JSON strings (form-data), try parse
      let parsedVariants = variants;
      let parsedImages = images;
      if (typeof variants === "string") {
        try { parsedVariants = JSON.parse(variants); } catch (e) {}
      }
      if (typeof images === "string") {
        try { parsedImages = JSON.parse(images); } catch (e) {}
      }

      const product = await this.productService.createProduct({
        name, slug, description, price: Number(price),
        discount_price: discount_price === null ? null : Number(discount_price),
        is_active: is_active === "false" ? false : Boolean(is_active),
        category_id,
        variants: parsedVariants,
        images: parsedImages // expects array of URLs or {url,is_featured}
      });

      res.status(201).json({ success: true, product });
    } catch (err) {
      console.error("createProduct error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async getProducts(req, res) {
    try {
      let { page = 1, limit = 12, search, category_id, minPrice, maxPrice, is_active, sort } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 12;

      const filters = {
        search: search ? String(search).trim() : null,
        category_id: category_id !== undefined ? category_id : null,
        minPrice: minPrice !== undefined ? Number(minPrice) : null,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : null,
        is_active: is_active !== undefined ? (is_active === "true" || is_active === "1") : null,
        sort: sort || null
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

      if (payload.price !== undefined && isNaN(Number(payload.price))) return res.status(400).json({ error: "price must be numeric" });

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

  // Variants
  async createVariant(req, res) {
    try {
      const { product_id } = req.params;
      const { size, color, sku } = req.body;
      if (!size || !color) return res.status(400).json({ error: "size and color are required" });
      if (!sku) return res.status(400).json({ error: "sku is required" });
      const variant = await this.productService.createVariant(product_id, { size, color, sku});
      res.status(201).json({ success: true, variant });
    } catch (err) {
      console.error("createVariant error:", err.message);
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
      console.error("updateVariant error:", err.message);
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
      console.error("deleteVariant error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  // Images - upload multiple files to Cloudinary then persist URLs
  // expects multipart/form-data with files field name "images"
  async uploadImages(req, res) {
    try {
      const { product_id } = req.params;

      // validate files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }

      // convert files to promises for cloudinary upload
      const uploadPromises = req.files.map(file => {
        // you can pass folder option from env
        const options = {
          folder: process.env.CLOUDINARY_FOLDER || "products",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
          overwrite: false
        };
        return uploadBuffer(file.buffer, options);
      });

      const uploadedResults = await Promise.all(uploadPromises);

      // map to URLs (store secure_url, public_id, is_featured default false)
      const imagesToSave = uploadedResults.map(r => ({
        url: r.secure_url,
        public_id: r.public_id,
        is_featured: false
      }));

      // save URLs to database
      const saved = await this.productService.addProductImages(product_id, imagesToSave);

      res.status(201).json({ success: true, images: saved });
    } catch (err) {
      console.error("uploadImages error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  // create image by URL (non-file)
  async createImage(req, res) {
    try {
      const { product_id } = req.params;
      const { image_url, is_featured = false } = req.body;
      if (!image_url) return res.status(400).json({ error: "image_url required" });
      const saved = await this.productService.addProductImages(product_id, [{ url: image_url, is_featured }]);
      res.status(201).json({ success: true, image: saved[0] });
    } catch (err) {
      console.error("createImage error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

 async updateImage(req, res) {
  try {
    const { product_id, image_id } = req.params;

    const image_url = req.body?.image_url;
    const is_featured = req.body?.is_featured;

    let newUrl = null;

    // 1. Upload file from buffer
    if (req.file) {
      console.log("UPLOADING FILE >>>");
      const result = await uploadBuffer(req.file.buffer, {
        folder: process.env.CLOUDINARY_FOLDER || "products",
        use_filename: true,
        unique_filename: true,
        overwrite: true,
      });

      newUrl = result.secure_url;
      console.log("UPLOAD RESULT:", newUrl);
    }

    // 2. URL update from body
    if (image_url && image_url.trim() !== "") {
      newUrl = image_url;
    }

    // 3. No update provided
    if (!newUrl && is_featured === undefined) {
      return res.status(400).json({
        error: "Provide image_url, file upload, or is_featured to update",
      });
    }

    // 4. Build payload
    const payload = {};
    if (newUrl) payload.image_url = newUrl;
    if (is_featured !== undefined)
      payload.is_featured = is_featured === "true" || is_featured === true;

    // 5. DB update
    const updated = await this.productService.updateImage(
      product_id,
      image_id,
      payload
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
      const { product_id, image_id } = req.params;
      const deleted = await this.productService.deleteImage(product_id, image_id);
      if (!deleted) return res.status(404).json({ error: "Image not found" });
      // Note: we are not deleting Cloudinary remote file here; you can add that if you want using cloudinary.uploader.destroy(public_id)
      res.json({ success: true, message: "Image deleted" });
    } catch (err) {
      console.error("deleteImage error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  // Reviews
  async createReview(req, res) {
    try {
      const { product_id } = req.params;
      const { rating, comment = "", user_id } = req.body;
      if (rating === undefined || isNaN(Number(rating))) return res.status(400).json({ error: "rating required numeric" });
      const r = Number(rating);
      if (r < 1 || r > 5) return res.status(400).json({ error: "rating 1-5" });
      if (!user_id) return res.status(400).json({ error: "user_id required" });
      const review = await this.productService.createReview(product_id, { rating: r, comment, user_id });
      res.status(201).json({ success: true, review });
    } catch (err) {
      console.error("createReview error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }

  async updateReview(req, res) {
    try {
      const { product_id, review_id } = req.params;
      const payload = req.body;
      if (payload.rating !== undefined) {
        const r = Number(payload.rating);
        if (isNaN(r) || r < 1 || r > 5) return res.status(400).json({ error: "rating 1-5" });
      }
      const updated = await this.productService.updateReview(product_id, review_id, payload);
      if (!updated) return res.status(404).json({ error: "Review not found" });
      res.json({ success: true, review: updated });
    } catch (err) {
      console.error("updateReview error:", err.message);
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
      console.error("deleteReview error:", err.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
}

module.exports = ProductController;

