Route Groups
1. Product Routes (Core CRUD)

POST / - Create a new product
GET / - Get all products (likely with filtering/pagination)
GET /:product_id - Get a specific product by ID
PUT /:product_id - Update a product
DELETE /:product_id - Delete a product

2. Variant Routes (Product variations like size/color)

POST /:product_id/variants - Add a variant to a product
PUT /:product_id/variants/:variant_id - Update a specific variant
DELETE /:product_id/variants/:variant_id - Delete a variant

Example: For a T-shirt (product_id=123), you could add variants for "Small-Red", "Medium-Blue", etc.
3. Image Routes (Product photos)

POST /:product_id/images/upload - Upload images via multipart form data (up to 10 files at once)

Uses the upload middleware (likely Multer) for file handling
Field name must be "images"


POST /:product_id/images - Add image by providing a URL (no file upload)
PUT /:product_id/images/:image_id - Update image metadata (like order, alt text)
DELETE /:product_id/images/:image_id - Remove an image

4. Review Routes (Customer reviews)

POST /:product_id/reviews - Add a review to a product
PUT /:product_id/reviews/:review_id - Update a review
DELETE /:product_id/reviews/:review_id - Delete a review