import { useState, type FormEvent, ChangeEvent } from "react"
import { useCategories } from "@/hooks/useCategories"

type VariantInput = {
    color: string
    sku: string
    is_featured: boolean
    sizes: string[]
    images: File[]
}

export type ProductFormValues = {
    product_id: string
    category_id: string
    name: string
    slug: string
    description: string
    price: string
    discount_price: string
    is_active: boolean
    variants: VariantInput[]
}

interface ProductFormProps {
    onSubmit?: (values: ProductFormValues) => void
}

const SIZES = ["S", "M", "L"]

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export default function ProductFormComponent({ onSubmit }: ProductFormProps) {
    const { categories, isLoading } = useCategories()

    const [form, setForm] = useState<ProductFormValues>({
        product_id: "",
        category_id: "",
        name: "",
        slug: "",
        description: "",
        price: "",
        discount_price: "",
        is_active: true,
        variants: [],
    })

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type, checked } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setForm((prev) => ({
            ...prev,
            name: value,
            slug: slugify(value),
        }))
    }

    const addVariant = () => {
        setForm((prev) => ({
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

    const updateVariantField = (
        index: number,
        field: keyof VariantInput,
        value: string | boolean | File[]
    ) => {
        setForm((prev) => {
            const next = [...prev.variants]
            next[index] = { ...next[index], [field]: value } as VariantInput
            return { ...prev, variants: next }
        })
    }

    const toggleVariantSize = (index: number, size: string) => {
        setForm((prev) => {
            const next = [...prev.variants]
            const sizes = next[index].sizes
            next[index] = {
                ...next[index],
                sizes: sizes.includes(size)
                    ? sizes.filter((s) => s !== size)
                    : [...sizes, size],
            }
            return { ...prev, variants: next }
        })
    }

    const handleVariantImages = (index: number, files: FileList | null) => {
        if (!files) return
        updateVariantField(index, "images", Array.from(files))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (onSubmit) {
            onSubmit(form)
        }
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8 max-w-6xl">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Create Product
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill out the details to add a new product.
                    </p>
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleNameChange}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm"
                            placeholder="Classic Hoodie"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Slug
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm"
                            placeholder="classic-hoodie"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm">
                            <option value="">
                                {isLoading
                                    ? "Loading categories..."
                                    : "Select category"}
                            </option>
                            {categories.map((cat) => (
                                <option
                                    key={cat.category_id}
                                    value={cat.category_id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm"
                            placeholder="1500.00"
                        />
                    </div>

                    {/* Discount Price */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Discount Price
                        </label>
                        <input
                            type="number"
                            name="discount_price"
                            value={form.discount_price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm"
                            placeholder="Optional"
                        />
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-3 mt-6">
                        <input
                            id="is_active"
                            type="checkbox"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/70"
                        />
                        <label
                            htmlFor="is_active"
                            className="text-sm font-medium text-gray-700">
                            Active product
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm min-h-[100px]"
                        placeholder="Soft premium cotton hoodie"
                    />
                </div>

                {/* Variants Section */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Variants
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Add color, SKU, sizes and images.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="black-button text-xs px-3 py-1.5">
                            + Add Variant
                        </button>
                    </div>

                    {form.variants.length === 0 && (
                        <p className="text-xs text-gray-500">
                            No variants added yet.
                        </p>
                    )}

                    <div className="space-y-4">
                        {form.variants.map((variant, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-md p-4 bg-gray-50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Variant {index + 1}
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Color */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Color
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.color}
                                            onChange={(e) =>
                                                updateVariantField(
                                                    index,
                                                    "color",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm"
                                            placeholder="Red"
                                        />
                                    </div>

                                    {/* SKU */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.sku}
                                            onChange={(e) =>
                                                updateVariantField(
                                                    index,
                                                    "sku",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-sm"
                                            placeholder="HOD-RED-001"
                                        />
                                    </div>

                                    {/* Featured */}
                                    <div className="flex items-center gap-2 mt-6">
                                        <input
                                            id={`is_featured_${index}`}
                                            type="checkbox"
                                            checked={variant.is_featured}
                                            onChange={(e) =>
                                                updateVariantField(
                                                    index,
                                                    "is_featured",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/70"
                                        />
                                        <label
                                            htmlFor={`is_featured_${index}`}
                                            className="text-xs font-medium text-gray-700">
                                            Featured variant
                                        </label>
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Sizes
                                    </label>
                                    <div className="flex flex-wrap gap-3 mt-1">
                                        {SIZES.map((size) => (
                                            <label
                                                key={size}
                                                className="inline-flex items-center gap-2 text-xs text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={variant.sizes.includes(
                                                        size
                                                    )}
                                                    onChange={() =>
                                                        toggleVariantSize(
                                                            index,
                                                            size
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/70"
                                                />
                                                <span>{size}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Images
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleVariantImages(
                                                index,
                                                e.target.files
                                            )
                                        }
                                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-black"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit (parent will handle actual logic) */}
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                    <button type="submit" className="black-button">
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    )
}
