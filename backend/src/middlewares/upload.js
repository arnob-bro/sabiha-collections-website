// src/middlewares/upload.js
const multer = require("multer");

// Use disk storage (temporary files) — simplest approach
const storage = multer.memoryStorage({});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6 MB max per file
  },
});

module.exports = upload;
