# Category API – Management & Listing

This guide serves two audiences:
- **Backend Flow Readers** understand what happens inside the API when each endpoint is hit.
- **Frontend Integrators** learn what to send, what comes back, and how to handle category data.

---

## Endpoint Summary

| Action | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| List Categories (Tree) | `GET` | `/categories` | None | Returns active categories in hierarchical tree structure |
| List All Categories | `GET` | `/categories/all` | None | Returns all categories (active + inactive) as flat list |
| Add Category | `POST` | `/categories` | None | Creates a new category |
| Edit Category | `PUT` | `/categories/:category_id` | None | Updates an existing category |

---

## List Categories (`GET /categories`)

### Backend Flow
- Calls `categoryService.listCategories()` which queries the database for all categories where `is_active = true`, ordered by `name` ASC.
- The flat list of active categories is passed to `buildCategoryTree()` utility function.
- `buildCategoryTree()` creates a hashmap of all categories, then builds a nested tree structure by:
  - Creating a map with each category having an empty `children` array.
  - Iterating through categories: if a category has a `parent_id`, it's added to its parent's `children` array; otherwise, it's added to the `roots` array.
- Returns the root categories (categories with no parent) as a tree structure where each node contains its children recursively.

### Request
No request body or query parameters required.

### Successful Response
```json
{
  "success": true,
  "data": [
    {
      "category_id": "uuid-1",
      "name": "Clothing",
      "slug": "clothing",
      "is_featured": true,
      "is_active": true,
      "parent_id": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "children": [
        {
          "category_id": "uuid-2",
          "name": "Men's Clothing",
          "slug": "mens-clothing",
          "is_featured": false,
          "is_active": true,
          "parent_id": "uuid-1",
          "created_at": "2024-01-01T00:00:00.000Z",
          "children": []
        },
        {
          "category_id": "uuid-3",
          "name": "Women's Clothing",
          "slug": "womens-clothing",
          "is_featured": false,
          "is_active": true,
          "parent_id": "uuid-1",
          "created_at": "2024-01-01T00:00:00.000Z",
          "children": []
        }
      ]
    }
  ]
}
```

### Error Responses
- `500`: Database error or internal server failure.

### Integration Notes
- Use this endpoint for displaying category navigation menus or filters on the frontend.
- Only active categories are returned, making it suitable for public-facing pages.
- The tree structure makes it easy to render nested category menus or breadcrumbs.
- Each category object includes a `children` array that may be empty for leaf categories.

---

## List All Categories (`GET /categories/all`)

### Backend Flow
- Calls `categoryService.listAllCategories()` which queries the database for all categories (regardless of `is_active` status), ordered by `name` ASC.
- Returns a flat array of all categories without tree nesting.
- This endpoint is typically used for admin interfaces where you need to see and manage all categories, including inactive ones.

### Request
No request body or query parameters required.

### Successful Response
```json
{
  "success": true,
  "data": [
    {
      "category_id": "uuid-1",
      "name": "Clothing",
      "slug": "clothing",
      "is_featured": true,
      "is_active": true,
      "parent_id": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "category_id": "uuid-2",
      "name": "Men's Clothing",
      "slug": "mens-clothing",
      "is_featured": false,
      "is_active": true,
      "parent_id": "uuid-1",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "category_id": "uuid-3",
      "name": "Archived Category",
      "slug": "archived-category",
      "is_featured": false,
      "is_active": false,
      "parent_id": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Error Responses
- `500`: Database error or internal server failure.

### Integration Notes
- Use this endpoint for admin panels where you need to manage all categories.
- The flat structure makes it easier to display in tables or lists.
- You can filter or transform this data on the frontend as needed.
- Includes inactive categories, so handle `is_active: false` appropriately in your UI.

---

## Add Category (`POST /categories`)

### Backend Flow
- Validates that `name` is provided (required field).
- Sets default values: `is_featured = false` and `is_active = false` if not provided.
- Auto-generates `slug` from `name` if not provided: converts to lowercase and replaces spaces with hyphens (e.g., "Men's Clothing" → "mens-clothing").
- If `parent_id` is provided, validates that the parent category exists via `categoryService.getCategoryById(parent_id)`. Returns `409` if parent doesn't exist.
- Inserts the new category into the database via `categoryService.addCategory()` with all provided fields.
- Returns the newly created category object.

### Request Body
```json
{
  "name": "Accessories",
  "slug": "accessories",
  "parent_id": null,
  "is_featured": true,
  "is_active": true
}
```

**Field Details:**
- `name` (required): Category name, must be unique.
- `slug` (optional): URL-friendly identifier. Auto-generated from `name` if not provided.
- `parent_id` (optional): UUID of parent category. Set to `null` for root-level categories.
- `is_featured` (optional): Boolean, defaults to `false`.
- `is_active` (optional): Boolean, defaults to `false`.

### Successful Response
```json
{
  "success": true,
  "data": {
    "category_id": "uuid-4",
    "name": "Accessories",
    "slug": "accessories",
    "is_featured": true,
    "is_active": true,
    "parent_id": null,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Responses
- `400`: Missing required field (`name`).
- `409`: Parent category does not exist (when `parent_id` is provided).
- `500`: Database error (e.g., duplicate name/slug, constraint violation) or internal server failure.

### Integration Notes
- Always provide a `name`; other fields are optional.
- If you want the category to appear in public listings, set `is_active: true`.
- Use `parent_id` to create subcategories. Ensure the parent exists before creating child categories.
- The backend enforces unique `name` values; handle `500` errors for duplicate names appropriately.
- Auto-generated slugs are based on the name, so ensure names are URL-friendly or provide custom slugs.

---

## Edit Category (`PUT /categories/:category_id`)

### Backend Flow
- Extracts `category_id` from URL parameters.
- Validates that `name` is provided (required field).
- Checks if the category exists via `categoryService.getCategoryById(category_id)`. Returns `409` if not found.
- If `parent_id` is provided:
  - Validates that the parent category exists. Returns `409` if parent doesn't exist.
  - Prevents circular references by checking if `parent_id === category_id`. Returns `400` if a category tries to be its own parent.
- Updates the category via `categoryService.editCategory()` with all provided fields.
- Returns the updated category object.

### Request Parameters
- `category_id` (URL parameter): UUID of the category to update.

### Request Body
```json
{
  "name": "Updated Category Name",
  "slug": "updated-category-slug",
  "parent_id": "uuid-1",
  "is_featured": false,
  "is_active": true
}
```

**Field Details:**
- `name` (required): Updated category name.
- `slug` (optional): Updated slug.
- `parent_id` (optional): Updated parent category UUID. Set to `null` to make it a root category.
- `is_featured` (optional): Updated featured status.
- `is_active` (optional): Updated active status.

### Successful Response
```json
{
  "success": true,
  "data": {
    "category_id": "uuid-4",
    "name": "Updated Category Name",
    "slug": "updated-category-slug",
    "is_featured": false,
    "is_active": true,
    "parent_id": "uuid-1",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Responses
- `400`: Missing required field (`name`) or category trying to be its own parent.
- `409`: Category does not exist or parent category does not exist.
- `500`: Database error (e.g., duplicate name/slug, constraint violation) or internal server failure.

### Integration Notes
- Always provide `name` in the request body.
- You can change a category's parent by providing a different `parent_id`, or make it root-level by setting `parent_id: null`.
- The backend prevents circular parent relationships (a category cannot be its own parent).
- When updating `parent_id`, ensure the new parent exists and is not a descendant of the current category (backend doesn't check for deep circular references, so be cautious).
- All fields in the request body will update the category; omit fields you don't want to change (though `name` is always required).

---

## Database Schema

The `categories` table structure:
- `category_id` (UUID, PRIMARY KEY): Unique identifier for the category.
- `name` (VARCHAR(150), UNIQUE, NOT NULL): Category name.
- `slug` (VARCHAR(150)): URL-friendly identifier.
- `is_featured` (BOOLEAN, DEFAULT FALSE): Whether the category is featured.
- `is_active` (BOOLEAN, DEFAULT FALSE): Whether the category is active and visible.
- `parent_id` (UUID, FOREIGN KEY): Reference to parent category (self-referencing). `NULL` for root categories.
- `created_at` (TIMESTAMP): Creation timestamp.

**Constraints:**
- `name` must be unique across all categories.
- `parent_id` references `categories(category_id)` with `ON DELETE CASCADE` (deleting a parent deletes all children).
- Categories can have multiple levels of nesting (parent → child → grandchild, etc.).

---

## Example Frontend Integration

### Fetching Category Tree
```js
import axios from "axios";

const fetchCategories = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/categories");
    const categoryTree = data.data;
    // Render tree structure in navigation menu
    return categoryTree;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};
```

### Fetching All Categories
```js
import axios from "axios";

const fetchCategories = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/categories/all");
    const categoryTree = data.data;
    // Render tree structure in navigation menu
    return categoryTree;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};
```

### Creating a Category
```js
const createCategory = async (categoryData) => {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/categories",
      {
        name: "New Category",
        is_active: true,
        is_featured: false,
        parent_id: null
      }
    );
    return data.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.error("Parent category does not exist");
    } else if (error.response?.status === 400) {
      console.error("Missing required fields");
    }
  }
};
```

### Updating a Category
```js
const updateCategory = async (categoryId, updates) => {
  try {
    const { data } = await axios.put(
      `http://localhost:3000/categories/${categoryId}`,
      {
        name: updates.name,
        is_active: updates.is_active,
        parent_id: updates.parent_id
      }
    );
    return data.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.error("Category or parent does not exist");
    } else if (error.response?.status === 400) {
      console.error("Invalid request");
    }
  }
};
```

---

## Notes for Backend Developers

- The `buildCategoryTree` utility assumes all categories in the input array are part of the same tree. Ensure your query returns all related categories.
- Category deletion is not implemented in the current API (routes are commented out). When implementing deletion, consider:
  - Cascading deletes (handled by database `ON DELETE CASCADE`).
  - Moving children to a different parent or preventing deletion if children exist.
- The current implementation doesn't validate slug uniqueness separately; it relies on database constraints for `name` uniqueness.
- Consider adding validation for slug format (alphanumeric, hyphens, underscores) if needed.
- The `editCategory` method may prevent deep circular references (e.g., A → B → C → A). But it is not rigorously tested yet.

