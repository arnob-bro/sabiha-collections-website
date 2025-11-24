const express = require("express");
const verifyAccessToken = require('../middlewares/verifyAccessToken');

function createCategoryRouter(categoryController) {
  const router = express.Router();

  router.get("/", categoryController.listCategories);
// admin routes
//   router.get("/all", verifyAccessToken, categoryController.listAllCategories);
//   router.post("/", verifyAccessToken, categoryController.addCategory);
//   router.put("/:category_id", verifyAccessToken, categoryController.editCategory);
//   router.delete("/:category_id", verifyAccessToken, categoryController.deleteCategory);

  router.get("/all", categoryController.listAllCategories);
  router.post("/", categoryController.addCategory);
  router.put("/:category_id", categoryController.editCategory);
//   router.delete("/:category_id", categoryController.deleteCategory);

  return router;
}

module.exports = createCategoryRouter;
