import { useState } from "react"
import { useProducts } from "@/hooks/useProducts"

import ProductFormComponent, {
    type ProductFormValues,
} from "./ProductFormComponent"

import type {
    CreateProductDto,
    CreateProductResponse,
    CreateVariantResponse,
} from "@/types/product"

export default function CreateProduct() {
    const { createProduct, createVariant, uploadVariantImages } = useProducts()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formValues: ProductFormValues) => {
        setIsSubmitting(true)
        setError(null)

        try {
            //* Step 1: Create product
            const productData: CreateProductDto = {
                name: formValues.name,
                slug: formValues.slug,
                description: formValues.description,
                price: parseFloat(formValues.price) || 0,
                discount_price: parseFloat(formValues.discount_price) || 0,
                is_active: formValues.is_active,
                category_id: formValues.category_id || null,
            }

            const productResponse: CreateProductResponse = await createProduct(
                productData
            )
            const productId = productResponse.product.product_id

            //* Step 2: Create variants and upload images for each variant
            for (const variant of formValues.variants) {
                // Create variant
                const variantResponse: CreateVariantResponse =
                    await createVariant({
                        productId,
                        data: {
                            color: variant.color,
                            sku: variant.sku,
                            sizes: variant.sizes,
                            is_featured: variant.is_featured,
                        },
                    })

                const variantId = variantResponse.variant.product_variant_id

                //* Step 3: Upload images for this variant (if any)
                if (variant.images && variant.images.length > 0) {
                    // Filter out images that are just URLs or don't have a file object
                    const imageFiles = variant.images
                        .filter((img) => img.file)
                        .map((img) => img.file as File)

                    if (imageFiles.length > 0) {
                        await uploadVariantImages({
                            variantId,
                            images: imageFiles,
                        })
                    }
                }
            }

            // Success - you might want to show a success message or redirect
            console.log("Product created successfully!")
        } catch (err: any) {
            setError(err.message || "Failed to create product")
            console.error("Error creating product:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="border border-gray-400">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <ProductFormComponent
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    )
}
