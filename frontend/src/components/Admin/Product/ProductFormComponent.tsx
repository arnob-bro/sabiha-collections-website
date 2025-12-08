import { useState, type FormEvent, type ChangeEvent } from "react"
import { useCategories } from "@/hooks/useCategories"

export type VariantImage = {
    id: string
    file?: File
    url?: string
    is_featured_one: boolean
    is_featured_two: boolean
}

type VariantInput = {
    color: string
    sku: string
    is_featured: boolean
    sizes: string[]
    images: VariantImage[]
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
    isSubmitting?: boolean
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"]

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export default function ProductFormComponent({
    onSubmit,
    isSubmitting = false,
}: ProductFormProps) {
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
        const { name, value, type } = e.target
        const checked =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : undefined

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
        value: string | boolean | VariantImage[]
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

    const toggleAllSizes = (index: number) => {
        setForm((prev) => {
            const next = [...prev.variants]
            const currentSizes = next[index].sizes
            const allSelected = SIZES.every((s) => currentSizes.includes(s))

            next[index] = {
                ...next[index],
                sizes: allSelected ? [] : [...SIZES],
            }
            return { ...prev, variants: next }
        })
    }

    const handleVariantImages = (index: number, files: FileList | null) => {
        if (!files) return
        const newImages: VariantImage[] = Array.from(files).map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            is_featured_one: false,
            is_featured_two: false,
        }))

        setForm((prev) => {
            const next = [...prev.variants]
            next[index] = {
                ...next[index],
                images: [...next[index].images, ...newImages],
            }
            return { ...prev, variants: next }
        })
    }

    const handleVariantImageUrl = (index: number, url: string) => {
        if (!url) return
        const newImage: VariantImage = {
            id: Math.random().toString(36).substring(7),
            url,
            is_featured_one: false,
            is_featured_two: false,
        }

        setForm((prev) => {
            const next = [...prev.variants]
            next[index] = {
                ...next[index],
                images: [...next[index].images, newImage],
            }
            return { ...prev, variants: next }
        })
    }

    const removeVariantImage = (variantIndex: number, imageId: string) => {
        setForm((prev) => {
            const next = [...prev.variants]
            next[variantIndex] = {
                ...next[variantIndex],
                images: next[variantIndex].images.filter(
                    (img) => img.id !== imageId
                ),
            }
            return { ...prev, variants: next }
        })
    }

    const toggleImageProperty = (
        variantIndex: number,
        imageId: string,
        property: keyof VariantImage
    ) => {
        setForm((prev) => {
            const next = [...prev.variants]
            next[variantIndex] = {
                ...next[variantIndex],
                images: next[variantIndex].images.map((img) => {
                    if (img.id !== imageId) return img

                    const updated: VariantImage = {
                        ...img,
                        [property]: !img[property],
                    }

                    // Ensure an image cannot be both featured_one and featured_two
                    if (
                        property === "is_featured_one" &&
                        updated.is_featured_one
                    ) {
                        updated.is_featured_two = false
                    }
                    if (
                        property === "is_featured_two" &&
                        updated.is_featured_two
                    ) {
                        updated.is_featured_one = false
                    }

                    return updated
                }),
            }
            return { ...prev, variants: next }
        })
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
                                    <h4 className="text-sm font-semibold text-gray-900 bg-yellow-500 px-3 py-1 rounded-full">
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
                                    <div className="flex items-center gap-10 mb-3">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Sizes
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleAllSizes(index)
                                            }
                                            className="text-xs text-primary hover:bg-gray-400 duration-300 bg-gray-300 px-2 py-1 rounded-full">
                                            {SIZES.every((s) =>
                                                variant.sizes.includes(s)
                                            )
                                                ? "Deselect All"
                                                : "Select All"}
                                        </button>
                                    </div>
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
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Images
                                    </label>

                                    {/* Image List */}
                                    {variant.images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            {variant.images.map((img) => (
                                                <div
                                                    key={img.id}
                                                    className="relative group border border-gray-200 rounded-md p-2 bg-white">
                                                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                                                        {img.file ? (
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    img.file
                                                                )}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={img.url}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) =>
                                                                    ((
                                                                        e.target as HTMLImageElement
                                                                    ).src =
                                                                        "https://placehold.co/100?text=Invalid+URL")
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 flex flex-row gap-4 items-center">
                                                        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                name="is_featured_one_two"
                                                                checked={
                                                                    img.is_featured_one
                                                                }
                                                                onChange={() =>
                                                                    toggleImageProperty(
                                                                        index,
                                                                        img.id,
                                                                        "is_featured_one"
                                                                    )
                                                                }
                                                                className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary/70"
                                                            />
                                                            Featured one
                                                        </label>

                                                        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                name="is_featured_one_two"
                                                                checked={
                                                                    img.is_featured_two
                                                                }
                                                                onChange={() =>
                                                                    toggleImageProperty(
                                                                        index,
                                                                        img.id,
                                                                        "is_featured_two"
                                                                    )
                                                                }
                                                                className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary/70"
                                                            />
                                                            Featured two
                                                        </label>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeVariantImage(
                                                                index,
                                                                img.id
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                        title="Remove image">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Image section */}
                                    <div className="flex flex-col md:flex-row gap-3 items-center">
                                        {/* Image upload section */}
                                        <div className="flex-1">
                                            <label
                                                htmlFor={`variant-images-${index}`}
                                                className="flex flex-1 items-center justify-center w-full cursor-pointer rounded-xl border border-gray-300 bg-primary text-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-primary/80 transition">
                                                Upload from device
                                            </label>

                                            <input
                                                id={`variant-images-${index}`}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleVariantImages(
                                                        index,
                                                        e.target.files
                                                    )
                                                }
                                                className="hidden"
                                            />
                                        </div>

                                        <span className="text-xs text-black">
                                            or
                                        </span>

                                        {/* IMAGE LINK SECTION */}
                                        <div className="flex-3 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Paste image URL"
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 text-xs"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault()
                                                        handleVariantImageUrl(
                                                            index,
                                                            e.currentTarget
                                                                .value
                                                        )
                                                        e.currentTarget.value =
                                                            ""
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    const input = e
                                                        .currentTarget
                                                        .previousElementSibling as HTMLInputElement
                                                    handleVariantImageUrl(
                                                        index,
                                                        input.value
                                                    )
                                                    input.value = ""
                                                }}
                                                className="px-3 py-2 bg-gray-600 text-white rounded-md text-xs font-medium hover:bg-gray-800 border border-gray-300 duration-300">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit (parent will handle actual logic) */}
                <div className="pt-4 border-t border-gray-200 flex justify-center">
                    <button
                        type="submit"
                        className="black-button bg-green-800"
                        disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    )
}
