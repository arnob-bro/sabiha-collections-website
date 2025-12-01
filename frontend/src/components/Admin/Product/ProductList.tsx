import type { Product } from "@/types/product"

interface ProductListProps {
    products: Product[]
    onEdit?: (product: Product) => void
}

export function ProductList({ products, onEdit }: ProductListProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Product
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Slug
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Price
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Discount Price
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Quantity
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            Status
                        </th>
                        {onEdit && (
                            <th className="px-4 py-2 text-right font-semibold text-gray-700">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.product_id} className="shadow-sm">
                            <td className="px-4 py-2">
                                {/* Product - image, slug, name, etc all in one TD */}
                                <div className="font-medium text-gray-900">
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                                {product.slug}
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                                {/* Slug */}${product.price}
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                                {/* price */}
                                {product.discount_price ? (
                                    <span className="text-green-600 font-medium">
                                        ${product.discount_price}
                                    </span>
                                ) : (
                                    "—"
                                )}
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                                {product.category_id ?? "—"}
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                                {product.is_active ? (
                                    <span className="text-green-600">Yes</span>
                                ) : (
                                    <span className="text-red-600">No</span>
                                )}
                            </td>
                            {onEdit && (
                                <td className="px-4 py-2 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(product)}
                                        className="text-xs bg-gray-300 px-3 py-1 rounded font-medium text-gray-900 hover:bg-gray-400 duration-300">
                                        Edit
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}

                    {products.length === 0 && (
                        <tr>
                            <td
                                colSpan={onEdit ? 8 : 7}
                                className="px-4 py-6 text-center text-sm text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
