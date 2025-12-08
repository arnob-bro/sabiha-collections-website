import type { Product, ProductImage } from "@/types/product"

interface ProductListProps {
    products: Product[]
    onEdit?: (product: Product) => void
}

export function ProductList({ products, onEdit }: ProductListProps) {
    const getFeaturedImage = (images?: ProductImage[]) => {
        if (!images || images.length === 0) return null
        return (
            images.find((img) => img.is_featured_one) ||
            images.find((img) => img.is_featured_two) ||
            images[0]
        )
    }

    return (
        <div className="space-y-6">
            {products.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white shadow-md p-8 text-center">
                    <p className="text-sm text-gray-500">No products found.</p>
                </div>
            ) : (
                products.map((product) => (
                    <div
                        key={product.product_id}
                        className="rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden">
                        {/* Product Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                product.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}>
                                            {product.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">
                                                Slug:
                                            </span>{" "}
                                            {product.slug}
                                        </p>
                                        {product.description && (
                                            <p className="text-gray-500">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">
                                                Price:
                                            </span>{" "}
                                            <span className="text-gray-900">
                                                ${product.price}
                                            </span>
                                        </div>
                                        {product.discount_price && (
                                            <div className="mt-1">
                                                <span className="font-medium">
                                                    Discount:
                                                </span>{" "}
                                                <span className="text-green-600 font-medium">
                                                    ${product.discount_price}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() => onEdit(product)}
                                            className="mt-3 text-xs bg-gray-300 px-3 py-1 rounded font-medium text-gray-900 hover:bg-gray-400 duration-300">
                                            Edit Product
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="p-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">
                                Variants ({product.variants.length})
                            </h4>

                            {product.variants.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No variants available.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {product.variants.map((variant) => {
                                        const featuredImage = getFeaturedImage(
                                            variant.images
                                        )
                                        return (
                                            <div
                                                key={variant.product_variant_id}
                                                className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex gap-4">
                                                    {/* Variant Image */}
                                                    {featuredImage ? (
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={
                                                                    featuredImage.image_url
                                                                }
                                                                alt={`${variant.color} variant`}
                                                                className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    ;(
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        "https://placehold.co/96?text=No+Image"
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md border border-gray-200 flex items-center justify-center">
                                                            <span className="text-xs text-gray-400">
                                                                No Image
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Variant Details */}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h5 className="font-medium text-gray-900">
                                                                        {
                                                                            variant.color
                                                                        }
                                                                    </h5>
                                                                    {variant.is_featured && (
                                                                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                                            Featured
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                    <p>
                                                                        <span className="font-medium">
                                                                            SKU:
                                                                        </span>{" "}
                                                                        {
                                                                            variant.sku
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-medium">
                                                                            Sizes:
                                                                        </span>{" "}
                                                                        {variant.sizes &&
                                                                        variant
                                                                            .sizes
                                                                            .length >
                                                                            0 ? (
                                                                            <span className="text-gray-900">
                                                                                {variant.sizes.join(
                                                                                    ", "
                                                                                )}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-gray-400">
                                                                                No
                                                                                sizes
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-medium">
                                                                            Images:
                                                                        </span>{" "}
                                                                        <span className="text-gray-900">
                                                                            {variant
                                                                                .images
                                                                                ?.length ||
                                                                                0}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* All Variant Images */}
                                                        {variant.images &&
                                                            variant.images
                                                                .length > 0 && (
                                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                                    <p className="text-xs font-medium text-gray-500 mb-2">
                                                                        All
                                                                        Images:
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {variant.images.map(
                                                                            (
                                                                                image
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        image.product_image_id
                                                                                    }
                                                                                    className="relative">
                                                                                    <img
                                                                                        src={
                                                                                            image.image_url
                                                                                        }
                                                                                        alt="Variant image"
                                                                                        className="w-16 h-16 object-cover rounded border border-gray-200"
                                                                                        onError={(
                                                                                            e
                                                                                        ) => {
                                                                                            ;(
                                                                                                e.target as HTMLImageElement
                                                                                            ).src =
                                                                                                "https://placehold.co/64?text=Error"
                                                                                        }}
                                                                                    />
                                                                                    {(image.is_featured_one ||
                                                                                        image.is_featured_two) && (
                                                                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] px-1 rounded-full">
                                                                                            {image.is_featured_one
                                                                                                ? "F1"
                                                                                                : "F2"}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
