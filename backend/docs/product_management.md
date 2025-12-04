# Product Management API Documentation

This guide explains the complete product management system, covering backend flows, database interactions, and frontend integration patterns. It's designed for both developers maintaining the codebase and those integrating with the API.

---

## System Architecture Overview

The product management system follows a three-tier architecture:

- **Routes Layer** (`productRoutes.js`): Defines HTTP endpoints and applies middleware
- **Controller Layer** (`productController.js`): Handles request/response logic, validation, and file processing
- **Service Layer** (`productService.js`): Manages database operations and business logic

**Key Dependencies:**

- `multer`: Handles multipart/form-data file uploads
- `cloudinary`: Cloud storage for product images
- `pg` (PostgreSQL): Database connection and queries

---

## Database Schema

### Tables Used

**products**

- `product_id` (PK, serial)
- `name`, `slug`, `description`
- `price`, `discount_price`
- `is_active` (boolean — controls product availability)
- `category_id` (FK, nullable)
- `created_at`, `updated_at`

**product_variants**

- `product_variant_id` (PK, serial)
- `product_id` (FK)
- `color`, `sku`
- `created_at`, `updated_at`

**variant_sizes**

- `variant_size_id` (PK)
- `product_variant_id` (FK)
- `size` _(string)_

**product_images**

- `product_image_id` (PK, serial)
- `product_id` (FK)
- `image_url`, `public_id` (Cloudinary reference)
- `is_featured` (boolean)
- `is_featured_one` _(primary featured image—shown first in cards)_
- `is_featured_two` _(hover image—shown when mouse hovers)_
- `created_at`, `updated_at`

**product_reviews**

- `product_review_id` (PK, serial)
- `product_id` (FK)
- `user_id` (FK)
- `rating` (1-5), `comment`
- `created_at`, `updated_at`

---

**products**

- `product_id` (PK, serial)
- `name`, `slug`, `description`
- `price`, `discount_price`
- `is_active` (boolean)
- `category_id` (FK, nullable)
- `created_at`, `updated_at`

**product_variants**

- `product_variant_id` (PK, serial)
- `product_id` (FK)
- `size`, `color`, `sku`
- `created_at`, `updated_at`

**product_images**

- `product_image_id` (PK, serial)
- `product_id` (FK)
- `image_url`, `public_id` (Cloudinary reference)
- `is_featured` (boolean)
- `created_at`, `updated_at`

**product_reviews**

- `product_review_id` (PK, serial)
- `product_id` (FK)
- `user_id` (FK)
- `rating` (1-5), `comment`
- `created_at`, `updated_at`

---

## Endpoint Reference

| Resource     | Method | Path                                                      | Auth     | Purpose                                 |
| ------------ | ------ | --------------------------------------------------------- | -------- | --------------------------------------- |
| **Products** |
| Create       | POST   | `/products`                                               | Required | Create new product with variants/images |
| List         | GET    | `/products`                                               | Optional | Paginated list with filters             |
| Get One      | GET    | `/products/:product_id`                                   | Optional | Full product details                    |
| Update       | PUT    | `/products/:product_id`                                   | Required | Modify product fields                   |
| Delete       | DELETE | `/products/:product_id`                                   | Required | Remove product + related data           |
| **Variants** |
| Create       | POST   | `/products/:product_id/variants`                          | Required | Add size/color variant                  |
| Update       | PUT    | `/products/:product_id/variants/:variant_id`              | Required | Modify variant                          |
| Delete       | DELETE | `/products/:product_id/variants/:variant_id`              | Required | Remove variant                          |
| **Images**   |
| Upload       | POST   | `/products/variants/:variant_id:product_id/images/upload` | Required | Upload files to Cloudinary              |
| Create URL   | POST   | `/products/variants/:variant_id/images`                   | Required | Add image by URL                        |
| Update File  | PUT    | `/products/variants/:variant_id/images/:image_id`         | Required | Replace with file                       |
| Delete       | DELETE | `/products/variants/:variant_id/images/:image_id`         | Required | Remove image record                     |
| **Reviews**  |
| Create       | POST   | `/products/:product_id/reviews`                           | Required | Add product review                      |
| Update       | PUT    | `/products/:product_id/reviews/:review_id`                | Required | Edit review                             |
| Delete       | DELETE | `/products/:product_id/reviews/:review_id`                | Required | Remove review                           |

---

## Products

### Create Product (POST /products)

#### Backend Flow

1. Validates required fields: `name`, `slug`, `price` (must be numeric)
2. Parses `variants` and `images` if sent as JSON strings (for form-data compatibility)
3. Calls `productService.createProduct()` which:
   - Begins database transaction
   - Inserts product record
   - Loops through variants array, inserting each into `product_variants`
   - Loops through images array, inserting each into `product_images`
   - Commits transaction or rolls back on error
4. Returns created product object (without variants/images in response)
5. Duplicate `name` and `slug` returns error

#### Response Body

```json
{
  "success": true,
  "product": {
    "product_id": "5fedc8dd-32cd-4b50-b566-1e4355ea7690",
    "category_id": null,
    "name": "Classic Hoodie",
    "slug": "classic-hoodie",
    "description": "Soft premium cotton hoodie",
    "price": "1500.00",
    "discount_price": "2009.00",
    "is_active": true,
    "created_at": "2025-11-29T20:30:54.010Z",
    "updated_at": "2025-11-29T20:30:54.010Z"
  }
}
```

#### Request (201 Created)

```json
{
  "name": "Classic Hoodie",
  "slug": "classic-hoodie",
  "description": "Soft premium cotton hoodie",
  "price": 1500,
  "discount_price": 2009,
  "is_active": true,
  "category_id": null
}
```

#### Error Responses

- **400**: Missing `name`, `slug`, or `price`; invalid price format
- **500**: Database transaction failure

#### Integration Notes

- When sending form-data (e.g., with file uploads), stringify `variants` and `images` arrays
- Images can be URLs (string) or objects with `{url, is_featured}` structure
- Transaction ensures data consistency—if any variant/image insert fails, entire operation rolls back
- Use slug for SEO-friendly URLs; ensure uniqueness at application level

## **Why `is_active` Is Used (Important Explanation)**

### ✔ Purpose of `is_active`

`is_active` indicates whether a product is **available for customers**. It is essential for:

- Temporarily disabling a product without deleting data.
- Keeping product history intact.
- Hiding discontinued items from the frontend.
- Preventing accidental ordering of unavailable products.

### ❌ What happens if you _do not_ use `is_active`?

- You would have to **delete** the product to hide it.
- Deleting causes:

  - Loss of reviews
  - Loss of inventory/variant info
  - Loss of images
  - Breaks SEO pages
  - Breaks orders linked to those products

- No way to “pause” or “disable” a product.
- Higher database management risk.

**`is_active` = safe soft-delete mechanism.**

---

### Get Products (GET /products)

#### Backend Flow

1. Parses query parameters: `page`, `limit`, `search`, `category_id`, `minPrice`, `maxPrice`, `is_active`, `sort`
2. Builds dynamic SQL WHERE clauses based on provided filters
3. Executes two queries in parallel:
   - COUNT query for total records
   - SELECT query with filters, sorting, and pagination (LIMIT/OFFSET)
4. Returns products array and pagination metadata

#### Query Parameters

- `page` (default: 1): Page number
- `limit` (default: 12): Items per page
- `search`: Searches in `name` and `description` (case-insensitive LIKE)
- `category_id`: Filter by category
- `minPrice`, `maxPrice`: Price range filters (৳1200 – ৳1400)
- `is_active`: "true"/"1" for active, "false"/"0" for inactive
- `sort`: "price_asc", "price_desc", "newest"

#### Request Example

```
GET /products?page=2&limit=10&search=shirt&minPrice=20&maxPrice=50&sort=price_asc
```

#### Response (200 OK)

```json
{
  "success": true,
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  },
  "products": [
    {
      "product_id": 15,
      "name": "Polo Shirt",
      "slug": "polo-shirt",
      "price": "34.99",
      "discount_price": null,
      "is_active": true,
      "category_id": 5,
      "created_at": "2025-01-10T14:20:00Z",
      "updated_at": "2025-01-10T14:20:00Z"
    }
  ]
}
```

#### Integration Notes

- Default pagination: 12 items per page
- Combine filters for refined searches (e.g., category + price range + search)
- Frontend should show loading state during fetch
- Use `totalPages` to render pagination controls

---

### Get Product by ID (GET /products/:product_id)

#### Backend Flow

1. Fetches product record from `products` table
2. If not found, returns 404
3. Executes three parallel queries for related data:
   - Variants from `product_variants`
   - Images from `product_images`
   - Reviews from `product_reviews`
4. Combines results into single response object

#### Response (200 OK)

```json
{
  "success": true,
  "product": {
    "product_id": 42,
    "name": "Classic T-Shirt",
    "slug": "classic-t-shirt",
    "description": "Comfortable cotton t-shirt",
    "price": "29.99",
    "discount_price": "24.99",
    "is_active": true,
    "category_id": 5,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "variants": [
      {
        "product_variant_id": 101,
        "size": [
                        "L",
                        "M",
                        "S"
                    ],
        "color": "Blue",
        "sku": "TSH-M-BLU",
        "product_id": 42,
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z",
       "images": [
      {
        "product_image_id": 201,
        "image_url": "https://res.cloudinary.com/.../img1.jpg",
        "public_id": "products/img1",
        "is_featured_one": true,
        "is_featured_two": false,
        "product_id": 42
      }
      {
        "product_image_id": 202,
        "image_url": "https://res.cloudinary.com/.../img2.jpg",
        "public_id": "products/img2",
        "is_featured_one": false,
        "is_featured_two": true,
        "product_id": 42
      }
    ],
      }
    ],
    "reviews": [
      {
        "product_review_id": 301,
        "rating": 5,
        "comment": "Great quality!",
        "user_id": 10,
        "product_id": 42,
        "created_at": "2025-01-16T09:00:00Z"
      }
    ]
  }
}
```

#### Error Responses

- **404**: Product not found
- **500**: Database query failure

#### Integration Notes

- Use this for product detail pages
- Display featured image first (`is_featured: true`)
- Calculate average rating from reviews array client-side

---

### Update Product (PUT /products/:product_id)

#### Backend Flow

1. Validates numeric price if provided
2. Builds dynamic UPDATE query with only provided fields
3. Allowed fields: `name`, `slug`, `description`, `price`, `discount_price`, `is_active`, `category_id`
4. Updates `updated_at` timestamp automatically
5. Returns updated product record

#### Request Body (Partial Update)

```json
{
  "price": 27.99,
  "discount_price": 22.99,
  "is_active": false
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "product": {
    "product_id": 42,
    "name": "Classic T-Shirt",
    "price": "27.99",
    "discount_price": "22.99",
    "is_active": false,
    "updated_at": "2025-01-17T11:00:00Z"
  }
}
```

#### Error Responses

- **400**: Invalid price format
- **404**: Product not found
- **500**: Database error

#### Integration Notes

- Send only fields that need updating (PATCH-style behavior)
- If no fields provided, returns current product unchanged
- Variants/images/reviews are updated via separate endpoints

---

### Delete Product (DELETE /products/:product_id)

#### Backend Flow

1. Begins database transaction
2. Deletes related records in order:
   - All reviews (`product_reviews` table)
   - All images (`product_images` table)
   - All variants (`product_variants` table)
3. Deletes product record
4. Commits transaction (rolls back if any deletion fails)
5. It also delete Cloudinary images 

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Product deleted"
}
```

#### Error Responses

- **404**: Product not found
- **500**: Transaction failure

#### Integration Notes

- Cascading delete removes all dependent data
- Consider soft delete (set `is_active: false`) for audit trails

---

## Variants

### Create Variant (POST /products/:product_id/variants)

#### Backend Flow

1. Validates required fields: `size`, `color`, `sku`
2. Inserts variant record linked to product
3. Returns created variant
4.  Each variant contains:

    * color
    * sku
    * sizes[]
    * images[]

#### Request Body

```json
{
  "sizes": [
        "S",
        "M",
        "L"
    ],
  "color": "Red",
  "sku": "TSH-XL-RED",
  "is_featured":true
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "variant": {
    "product_variant_id": 102,
    "sizes": [
        "S",
        "M",
        "L"
    ],
    "color": "Red",
    "sku": "TSH-XL-RED",
    "product_id": 42,
    "is_featured":true,
    "created_at": "2025-01-17T12:00:00Z"
  }
}
```

#### Integration Notes

- SKU should be unique per variant—enforce at application level
- Use for inventory management and order tracking

---

### Update Variant (PUT /products/:product_id/variants/:variant_id)

#### Backend Flow

1. Builds dynamic UPDATE for provided fields (`size`, `color`, `sku`,)
2. Ensures variant belongs to specified product
3. Returns updated variant

#### Request Body(partial update)

```json
  {
    "sizes": [
        "S",
        "M",
        "L"
    ],
    "color": "Redish",
    
    "is_featured": true
}

```

---

### Delete Variant (DELETE /products/:product_id/variants/:variant_id)

#### Backend Flow

1. Deletes variant record with image from cloudinary and database
2. Verifies it belongs to the specified product
3. Returns success message

---

## Images


### Image Display Logic (Frontend)

* Card main image → image where `is_featured_one = true`
* Card hover image → image where `is_featured_two = true`
* if both are false then they are image will be available in product details page

### Upload Images (POST /products/variants/:variant_id/images/upload)

#### Backend Flow

1. Middleware: `upload.array("images", 10)` processes up to 10 files
   - Stores files in memory as buffers
   - Validates file type (images only)
   - Enforces 6 MB limit per file
2. Controller validates at least one file uploaded
3. Uploads each file to Cloudinary in parallel:
   - Uses `uploadBuffer()` helper
   - Stores in folder from `CLOUDINARY_FOLDER` env variable
   - Generates unique filename automatically
4. Saves URLs and `public_id` to `product_images` table
5. Returns array of created image records

#### Request (multipart/form-data)

```
POST /products/42/images/upload
Content-Type: multipart/form-data

for testing the upload from postman:-
Postman → Body → form-data

| Key             | Type | Value        |
| --------------- | ---- | ------------ |
| images          | File | choose image |
| is_featured_one | Text | true         |
| is_featured_two | Text | false        |

images: [File1.jpg, File2.png]


| Form Input                 | Saved in DB? | Output        |
| -------------------------- | ------------ | ------------- |
| is_featured_one = true     | Yes          | Featured One  |
| is_featured_two = true     | Yes          | Featured Two  |
| both false or not provided | Yes          | Normal image  |
| both true                  | ❌ Rejected   | Error message |

```

#### Response (201 Created)

```json
{
  "success": true,
  "images": [
    {
      "product_image_id": 202,
      "image_url": "https://res.cloudinary.com/.../file1.jpg",
      "public_id": "products/file1",
      "is_featured_one": true,
       "is_featured_two": false,
      "product_id": 42
    },
    {
      "product_image_id": 203,
      "image_url": "https://res.cloudinary.com/.../file2.png",
      "public_id": "products/file2",
      "is_featured_one": true,
       "is_featured_two": false,
      "product_id": 42
    }
  ]
}
```

#### Error Responses

- **400**: No files uploaded; non-image file type
- **500**: Cloudinary upload failure

#### Integration Notes

- Use `FormData` API in JavaScript:

  ```javascript
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  await fetch("/products/42/images/upload", {
    method: "POST",
    body: formData,
  });
  ```

- All uploaded images default to `is_featured_one: false` and `is_featured_two: false`—update separately to feature one

---

### Create Image by URL (POST /products/variants/:variant_id/images)

#### Backend Flow

1. Validates `image_url` parameter
2. Inserts image record without Cloudinary upload
3. Useful for external URLs or already-uploaded assets

#### Request Body

```json
{
  "image_url": "https://cdn.example.com/product.jpg",
  "is_featured_one": true,
  "is_featured_two": false,
}
```

---

### Update Image (PUT /products/variants/:variant_id/images/:image_id)

#### Backend Flow

Supports THREE update methods:

1. **File Upload** (`/upload` route with `upload.single("image")`):
   - Uploads new file to Cloudinary
   - Replaces `image_url` with new URL
2. **URL Update** (standard route with `image_url` in body):
   - Updates `image_url` field directly
3. **Featured Toggle**:
   - Updates `is_featured_one` boolean
   - Updates `is_featured_two` boolean

Can update file/URL and also delete old file from cloudinary storage and featured status simultaneously.

#### Request (File Upload)

```
PUT /products/42/images/202/upload
Content-Type: multipart/form-data

image: NewFile.jpg
is_featured: true
```

#### Request (URL Update)

```json
{
  "image_url": "https://cdn.example.com/new-image.jpg",
   "is_featured_one": true,
  "is_featured_two": false,
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "image": {
    "product_image_id": 202,
    "image_url": "https://res.cloudinary.com/.../newfile.jpg",
    "is_featured_one": true,
    "is_featured_two": false,
    "updated_at": "2025-01-17T13:00:00Z"
  }
}
```

#### Error Responses

- **400**: No update data provided
- **404**: Image not found or doesn't belong to product
- **500**: Upload/database failure

#### Integration Notes

- Use `/upload` route for file replacements
- Use standard route for URL/featured updates
- Only one image should be featured per product—implement toggle logic client-side

---

### Delete Image (DELETE /products/variants/:product_id/images/:image_id)

#### Backend Flow

1. Deletes image record from database and cloudinary also 
2. **delete file from Cloudinary**—using this manually:
   ```javascript
   const { public_id } = imageRecord;
   await cloudinary.uploader.destroy(public_id);
   ```

#### Integration Notes


- Consider cascading delete when product is removed

## **Why `is_featured`, `is_featured_one`, `is_featured_two` Are Used**

### ✔ **1. `is_featured`**

A general-purpose flag that indicates this variant is a **featured variant for the product which will be visible in the card box**.

### ✔ **2. `is_featured_one`**

If `true`, this image will appear **first** in the product card on listing pages.

### ✔ **3. `is_featured_two`**

If `true`, this image will appear on **hover state** (when user moves mouse over the product card).

### 📌 Why these are important:

* Product cards usually need **two images**:

  * One main image
  * One hover image to preview another angle
* This is used in major e‑commerce UI standards (Zara, H&M, Uniqlo, Amazon).

### ❌ What happens if you don’t use these flags?

* Frontend cannot determine which image should appear first.
* Cards may show random images.
* Hover effect becomes impossible without guessing.
* Sorting images per card becomes inconsistent.


---

## Reviews

### Create Review (POST /products/:product_id/reviews)

#### Backend Flow

1. Validates `rating` (1-5), `user_id`
2. `comment` is optional (defaults to empty string)
3. Inserts review linked to product and user

#### Request Body

```json
{
  "rating": 5,
  "comment": "Excellent product!",
  "user_id": 10
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "review": {
    "product_review_id": 302,
    "rating": 5,
    "comment": "Excellent product!",
    "user_id": 10,
    "product_id": 42,
    "created_at": "2025-01-17T14:00:00Z"
  }
}
```

#### Error Responses

- **400**: Missing `rating`/`user_id`; rating out of 1-5 range
- **500**: Database error

#### Integration Notes

- Require authentication to get `user_id`
- Prevent duplicate reviews per user—check at service level
- Calculate average rating by aggregating all reviews

---

### Update Review (PUT /products/:product_id/reviews/:review_id)

#### Backend Flow

1. Updates `rating` and/or `comment` fields
2. Validates rating range if provided
3. Returns updated review

---

### Delete Review (DELETE /products/:product_id/reviews/:review_id)

#### Backend Flow

1. Deletes review record
2. Verifies it belongs to specified product

---

## File Upload Configuration

### Multer Middleware (`upload.js`)

**Purpose**: Processes multipart/form-data file uploads before reaching controller.

**Configuration**:

```javascript
const storage = multer.memoryStorage(); // Stores files as buffers in RAM
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept
  } else {
    cb(new Error("Only image files allowed!"), false); // Reject
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB max
});
```

**Why Memory Storage?**

- Files stored as buffers (`req.file.buffer`)
- Avoids disk I/O; suitable for small-medium files
- Passed directly to Cloudinary without temp files

**Methods**:

- `upload.single("image")`: One file, field name "image"
- `upload.array("images", 10)`: Up to 10 files, field name "images"

**Error Handling**:

- Multer errors (file too large, wrong type) are caught by Express error middleware
- Add custom error handler in amin app file

---

## Cloudinary Integration

### Configuration (`cloudinary.js`)

```javascript
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

module.exports = { cloudinary, uploadBuffer };
```

---

### **Why Cloudinary Config?**

- Centralized configuration using environment variables (`cloud_name`, `api_key`, `api_secret`)
- Ensures secure authentication before performing any uploads
- Makes Cloudinary accessible across different files through a single config module

---

### **Why `uploadBuffer`?**

- Uploads images directly from memory buffer (no temporary files)
- Works perfectly with Multer's memory storage (`req.file.buffer`)
- Faster and avoids disk operations, suitable for Node.js APIs handling frequent uploads

---

### **How `uploadBuffer` Works**

- Wraps Cloudinary's `upload_stream` inside a Promise
- Streams the raw buffer data directly to Cloudinary
- Supports custom upload options (folder, transformations, public_id, etc.)
- Resolves with Cloudinary response or rejects with error

---

### **Methods**

- `cloudinary.uploader.upload_stream(options, callback)`

  - Used internally to handle streaming uploads

- `uploadStream.end(buffer)`

  - Sends the buffer to Cloudinary to finalize upload

---

**Environment Variables Required**:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER` (optional, defaults to "products")

## Testing Checklist

### Products

- [ ] Create product with variants and images
- [ ] Create product with empty variants/images arrays
- [ ] List products with no filters
- [ ] Filter by search, category, price range
- [ ] Sort by price and date
- [ ] Pagination (first, middle, last page)
- [ ] Get non-existent product (404)
- [ ] Update product fields
- [ ] Delete product (verify cascade)

### Images

- [ ] Upload single file
- [ ] Upload multiple files (10 max)
- [ ] Upload non-image file (should fail)
- [ ] Upload file > 6 MB (should fail)
- [ ] Create image by URL
- [ ] Update image with file
- [ ] Update image with URL
- [ ] Toggle featured status
- [ ] Delete image

### Variants & Reviews

- [ ] Create/update/delete variants
- [ ] Create review with 1-5 rating
- [ ] Create review with invalid rating (should fail)
- [ ] Update review
- [ ] Delete review

---

## Troubleshooting

### "No images uploaded" Error

- Ensure field name is "images" (matches `upload.array("images")`)
- Check Content-Type header is `multipart/form-data`
- Verify files aren't empty

### Cloudinary Upload Fails

- Confirm environment variables are set correctly
- Check API key permissions in Cloudinary dashboard
- Verify network connectivity to Cloudinary servers
- Review file size (Cloudinary free tier has limits)

### Transaction Rollback

- Check foreign key constraints (category_id, user_id must exist)
- Verify all required fields are provided
- Review database logs for constraint violations

### Images Not Displaying

- Verify CORS is configured on Cloudinary account
- Check URLs are HTTPS
- Ensure `secure_url` (not `url`) is saved
- Test URL directly in browser

---

## Quick Reference

### File Structure

```
src/
├── controllers/
│   └── productController.js    # Request/response handling
├── services/
│   └── productService.js        # Database operations
├── routes/
│   └── productRoutes.js         # Endpoint definitions
├── middlewares/
│   └── upload.js                # Multer configuration
└── config/
    └── cloudinary.js            # Cloudinary setup
```

### Key Methods

**Controller**: `createProduct`, `getProducts`, `getProductById`, `updateProduct`, `deleteProduct`, `uploadImages`, `createImage`, `updateImage`, `deleteImage`, `createVariant`, `updateVariant`, `deleteVariant`, `createReview`, `updateReview`, `deleteReview`

**Service**: Same as controller plus `addProductImages` (internal helper)

### Database Query Patterns

- **Dynamic WHERE**: Build clauses array, join with AND
- **Parameterized queries**: Always use $1, $2 placeholders
- **Transactions**: `BEGIN → operations → COMMIT/ROLLBACK`
- **Parallel queries**: `Promise.all([query1, query2])`

---

## **Notes for Backend Developers**

- The Cloudinary configuration relies on environment variables. Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correctly defined before the server starts.
- `uploadBuffer` is designed specifically for _buffer-based uploads_ (e.g., from Multer memory storage). Do not use it with file paths or streams from disk.
- This module uses `cloudinary.uploader.upload_stream`, which supports transformations and folder organization through the `options` parameter. Make sure to pass the required folder name if your Cloudinary setup uses structured folders.
- Errors during uploads (invalid file, Cloudinary outage, auth failure) will reject the Promise. Always wrap calls to `uploadBuffer` in `try/catch` inside controllers.
- `uploadBuffer` returns the full Cloudinary response object, which includes `url`, `secure_url`, `public_id`, and metadata. Store `public_id` in the database if you plan to update or delete images later.
- The module currently does **not** validate MIME types. It assumes Multer or a custom validator handles file type checks before uploading.
- If your project requires image transformations (resize, quality optimization, format conversion), pass transformation options through the `options` argument.
- The upload function does not handle large files or video uploads differently. Consider increasing request size limits or adding separate handlers for heavy media.

---
