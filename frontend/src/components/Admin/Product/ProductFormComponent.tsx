import { useState } from "react"

export default function ProductFormComponent({ onSubmit }) {
    const [product, setProduct] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        discount_price: "",
        category_id: "",
        is_active: true,
        variants: [],
    })

    const addVariant = () => {
        setProduct((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    color: "",
                    sku: "",
                    is_featured: false,
                    sizes: [],
                    images: [],
                },
            ],
        }))
    }

    const updateVariant = (index, field, value) => {
        const updated = [...product.variants]
        updated[index][field] = value
        setProduct({ ...product, variants: updated })
    }

    const updateVariantImage = (index, files) => {
        const updated = [...product.variants]
        updated[index].images = Array.from(files)
        setProduct({ ...product, variants: updated })
    }

    const updateVariantSize = (index, size) => {
        const updated = [...product.variants]
        const sizes = updated[index].sizes

        if (sizes.includes(size)) {
            updated[index].sizes = sizes.filter((s) => s !== size)
        } else {
            updated[index].sizes = [...sizes, size]
        }

        setProduct({ ...product, variants: updated })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(product) // return everything to parent
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* PRODUCT INFO */}
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                        setProduct({ ...product, name: e.target.value })
                    }
                />
            </div>

            <div>
                <label>Slug:</label>
                <input
                    type="text"
                    value={product.slug}
                    onChange={(e) =>
                        setProduct({ ...product, slug: e.target.value })
                    }
                />
            </div>

            <div>
                <label>Description:</label>
                <textarea
                    value={product.description}
                    onChange={(e) =>
                        setProduct({ ...product, description: e.target.value })
                    }></textarea>
            </div>

            <div>
                <label>Price:</label>
                <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                        setProduct({
                            ...product,
                            price: Number(e.target.value),
                        })
                    }
                />
            </div>

            <div>
                <label>Discount Price:</label>
                <input
                    type="number"
                    value={product.discount_price}
                    onChange={(e) =>
                        setProduct({
                            ...product,
                            discount_price: Number(e.target.value),
                        })
                    }
                />
            </div>

            <div>
                <label>Category ID:</label>
                <input
                    type="text"
                    value={product.category_id}
                    onChange={(e) =>
                        setProduct({ ...product, category_id: e.target.value })
                    }
                />
            </div>

            <div>
                <label>Is Active:</label>
                <input
                    type="checkbox"
                    checked={product.is_active}
                    onChange={(e) =>
                        setProduct({ ...product, is_active: e.target.checked })
                    }
                />
            </div>

            <hr />

            {/* VARIANTS */}
            <div>
                <button type="button" onClick={addVariant}>
                    + Add Variant
                </button>
            </div>

            {product.variants.map((variant, index) => (
                <div
                    key={index}
                    style={{ border: "1px solid #aaa", padding: "10px" }}>
                    <h4>Variant {index + 1}</h4>

                    <div>
                        <label>Color:</label>
                        <input
                            type="text"
                            value={variant.color}
                            onChange={(e) =>
                                updateVariant(index, "color", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>SKU:</label>
                        <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) =>
                                updateVariant(index, "sku", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Featured:</label>
                        <input
                            type="checkbox"
                            checked={variant.is_featured}
                            onChange={(e) =>
                                updateVariant(
                                    index,
                                    "is_featured",
                                    e.target.checked
                                )
                            }
                        />
                    </div>

                    {/* SIZES */}
                    <div>
                        <label>Sizes:</label>
                        {["S", "M", "L", "XL"].map((size) => (
                            <label key={size} style={{ marginRight: "10px" }}>
                                <input
                                    type="checkbox"
                                    checked={variant.sizes.includes(size)}
                                    onChange={() =>
                                        updateVariantSize(index, size)
                                    }
                                />
                                {size}
                            </label>
                        ))}
                    </div>

                    {/* IMAGES */}
                    <div>
                        <label>Images:</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                updateVariantImage(index, e.target.files)
                            }
                        />
                    </div>
                </div>
            ))}

            <button type="submit">Submit Product</button>
        </form>
    )
}
