// A single category object (flat structure — e.g., /categories/all)
export interface Category {
    category_id: string
    name: string
    slug: string
    is_featured: boolean
    is_active: boolean
    parent_id: string | null
    created_at: string // ISO date string
}

// Category node with nested children (for /categories)
export interface CategoryTreeNode extends Category {
    children: CategoryTreeNode[]
}

// Request body for creating a category
export interface CreateCategoryDto {
    name: string
    slug?: string
    parent_id?: string | null
    is_featured?: boolean
    is_active?: boolean
}

// Request body for updating a category
export interface UpdateCategoryDto {
    name: string
    slug?: string
    parent_id?: string | null
    is_featured?: boolean
    is_active?: boolean
}

// API error shape (optional, but useful)
export interface ApiError {
    message: string
    statusCode?: number
}
