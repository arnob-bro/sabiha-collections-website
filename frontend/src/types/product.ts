// GET all products /products
export interface ProductListResponse {
    success: boolean
    pagination: Pagination
    products: Product[]
}

//! ==================================  DATA
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

//! =========================   CREATE a product /products
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
    sizes?: string[]
    color: string
    sku: string
    is_featured: boolean
}
export interface CreateVariantResponse {
    success: boolean
    variant: ProductVariant
}
export interface UploadVariantImagesResponse {
    success: boolean
    images: ProductImage[]
}
