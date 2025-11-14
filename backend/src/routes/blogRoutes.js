const express = require("express");
const multer = require("multer");

function createBlogRouter(blogController) {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

    router.get('/', blogController.getAllBlogs);
    router.get('/:blog_id', blogController.getBlogById);
    router.post(
      '/',
      upload.fields([
        { name: "image", maxCount: 1 },
        { name: "author_avatar", maxCount: 1 }
      ]),
      blogController.createBlog
    );
    
    router.put(
      '/:blog_id', 
      upload.fields([
        { name: "image", maxCount: 1 },
        { name: "author_avatar", maxCount: 1 }
      ]),
      blogController.updateBlog);
    router.patch('/:blog_id/toggle', blogController.toggleActive);

  return router;
}

module.exports = createBlogRouter;
