// GET all products /products
export interface ProductListResponse {
    success: boolean
    pagination: Pagination
    products: Product[]
}

// CREATE a product /products
export interface CreateProductDto {
    name: string
    slug: string
    description: string
    price: number
    discount_price: number
    is_active: boolean
    category_id: string | null
}
export interface CreateProductResponse {
    success: boolean
    product: Product
}
export interface CreateVariantDto {
    product_id: string
    sizes: string[]
    color: string
    sku: string
    is_featured: boolean
}
export interface CreateVariantResponse {
    success: boolean
    variant: ProductVariant
}
export interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface Product {
    product_id: string
    category_id: string | null
    name: string
    slug: string
    description?: string
    price: string
    discount_price?: string
    is_active: boolean
    created_at: string
    updated_at: string
    variants: ProductVariant[]
}

export interface ProductVariant {
    product_id: string
    product_variant_id: string
    color: string
    sku: string
    is_featured: boolean
    created_at?: string
    updated_at?: string
    sizes: string[]
    images?: ProductImage[]
}

export interface ProductImage {
    product_image_id: string
    image_url: string
    public_id: string
    is_featured_one: boolean
    is_featured_two: boolean
}

// export interface ProductImage {
//     product_image_id: number
//     product_id: number
//     image_url: string
//     public_id?: string
//     is_featured: boolean
//     created_at: string
//     updated_at: string
// }

// export interface ProductReview {
//     product_review_id: number
//     product_id: number
//     user_id: number
//     rating: number
//     comment: string
//     created_at: string
//     updated_at: string
// }

// export interface ProductDetail extends Product {
//     variants: ProductVariant[]
//     images: ProductImage[]
//     reviews: ProductReview[]
// }

// export interface ProductFilters {
//     page?: number
//     limit?: number
//     search?: string
//     category_id?: number
//     minPrice?: number
//     maxPrice?: number
//     is_active?: boolean
//     sort?: "price_asc" | "price_desc" | "newest"
// }

// export interface PaginationData {
//     page: number
//     limit: number
//     total: number
//     totalPages: number
// }

// // Request body for creating a product
// export interface CreateProductDto {
//     name: string
//     slug?: string
//     price: number | string
//     description?: string
//     discount_price?: number | string
//     is_active?: boolean
//     category_id?: number
//     variants?: Array<{
//         size: string
//         color: string
//         sku: string
//     }>
//     images?: Array<
//         | string
//         | {
//               url: string
//               is_featured?: boolean
//           }
//     >
// }

// // Request body for updating a product
// export interface UpdateProductDto {
//     name?: string
//     slug?: string
//     price?: number | string
//     description?: string
//     discount_price?: number | string
//     is_active?: boolean
//     category_id?: number
// }
