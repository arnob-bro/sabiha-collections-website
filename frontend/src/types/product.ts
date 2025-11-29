export interface Product {
    product_id: number
    name: string
    slug: string
    description?: string
    price: string
    discount_price?: string
    is_active: boolean
    category_id?: number
    created_at: string
    updated_at: string
}

export interface ProductVariant {
    product_variant_id: number
    product_id: number
    size: string
    color: string
    sku: string
    created_at: string
    updated_at: string
}

export interface ProductImage {
    product_image_id: number
    product_id: number
    image_url: string
    public_id?: string
    is_featured: boolean
    created_at: string
    updated_at: string
}

export interface ProductReview {
    product_review_id: number
    product_id: number
    user_id: number
    rating: number
    comment: string
    created_at: string
    updated_at: string
}

export interface ProductDetail extends Product {
    variants: ProductVariant[]
    images: ProductImage[]
    reviews: ProductReview[]
}

export interface ProductFilters {
    page?: number
    limit?: number
    search?: string
    category_id?: number
    minPrice?: number
    maxPrice?: number
    is_active?: boolean
    sort?: "price_asc" | "price_desc" | "newest"
}

export interface PaginationData {
    page: number
    limit: number
    total: number
    totalPages: number
}
