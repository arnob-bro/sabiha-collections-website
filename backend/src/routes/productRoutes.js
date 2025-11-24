// src/routes/productRoutes.js
const express = require("express");
const upload = require("../middlewares/upload");
const createProductRouter = (productController) => {
  const router = express.Router();

  // Products
  router.post("/", productController.createProduct);
  router.get("/", productController.getProducts);
  router.get("/:product_id", productController.getProductById);
  router.put("/:product_id", productController.updateProduct);
  router.delete("/:product_id", productController.deleteProduct);

  // Variants
  router.post("/:product_id/variants", productController.createVariant);
  router.put("/:product_id/variants/:variant_id", productController.updateVariant);
  router.delete("/:product_id/variants/:variant_id", productController.deleteVariant);

  // Images
  // multipart upload of multiple files (field name "images")
  router.post("/:product_id/images/upload", upload.array("images", 10), productController.uploadImages);
  router.post("/:product_id/images", productController.createImage); // create by URL
  router.put("/:product_id/images/:image_id", productController.updateImage);
  router.delete("/:product_id/images/:image_id", productController.deleteImage);

  // Reviews
  router.post("/:product_id/reviews", productController.createReview);
  router.put("/:product_id/reviews/:review_id", productController.updateReview);
  router.delete("/:product_id/reviews/:review_id", productController.deleteReview);

  return router;
};

module.exports = createProductRouter;