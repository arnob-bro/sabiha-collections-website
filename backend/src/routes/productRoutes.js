const express = require("express");
const upload = require("../middlewares/upload");

const createProductRouter = (productController) => {
  const router = express.Router();

  // ---------------------
  // Product CRUD
  // ---------------------
  router.post("/", productController.createProduct);
  router.get("/", productController.getProducts);
  router.get("/:product_id", productController.getProductById);
  router.put("/:product_id", productController.updateProduct);
  router.delete("/:product_id", productController.deleteProduct);

  // ---------------------
  // Variant CRUD
  // ---------------------
  router.post("/:product_id/variants", productController.createVariant);
  router.put("/:product_id/variants/:variant_id", productController.updateVariant);
  router.delete("/:product_id/variants/:variant_id", productController.deleteVariant);

  // ---------------------
  // Product Images
  // ---------------------
  // Upload multiple images to a variant
  router.post(
    "/variants/:variant_id/images/upload",
    upload.array("images", 10),
    productController.uploadImages
  );

  // Add image via URL
  router.post("/variants/:variant_id/images", productController.createImage);

  // Update single image (file or URL)
  router.put(
    "/variants/:variant_id/images/:image_id",
    upload.single("image"),
    productController.updateImage
  );

  // Delete image
  router.delete("/variants/:variant_id/images/:image_id", productController.deleteImage);

  // ---------------------
  // Reviews
  // ---------------------
  router.post("/:product_id/reviews", productController.createReview);
  router.put("/:product_id/reviews/:review_id", productController.updateReview);
  router.delete("/:product_id/reviews/:review_id", productController.deleteReview);

  return router;
};

module.exports = createProductRouter;
