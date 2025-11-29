import React from "react"
import type { Category } from "../../../types/category"
import type { CreateProductDto } from "../../../types/product"

export interface ProductFormState {
    name: string
    slug: string
    description: string
    price: string
    discount_price: string
    is_active: boolean
    category_id: string
}

interface ProductFormProps {
    mode: "create" | "edit"
    form: ProductFormState
    categories: Category[]
    loading: boolean
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
}

export function ProductForm({
    mode,
    form,
    categories,
    loading,
    onChange,
    onSubmit,
    onCancel,
}: ProductFormProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 max-w-2xl bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Name *
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="p-2 mt-1 block w-full rounded-md border border-gray-300 shadow-lg focus:ring-gray-500 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Slug
                </label>
                <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={onChange}
                    placeholder="Optional – auto-generated from name if empty"
                    className="p-2 mt-1 block w-full rounded-md border border-gray-300 shadow-lg focus:ring-gray-500 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={4}
                    className="p-2 mt-1 block w-full rounded-md border border-gray-300 shadow-lg focus:ring-gray-500 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price *
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={onChange}
                        step="0.01"
                        min="0"
                        required
                        className="p-2 mt-1 block w-full rounded-md border border-gray-300 shadow-lg focus:ring-gray-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Discount Price
                    </label>
                    <input
                        type="number"
                        name="discount_price"
                        value={form.discount_price}
                        onChange={onChange}
                        step="0.01"
                        min="0"
                        className="p-2 mt-1 block w-full rounded-md border border-gray-300 shadow-lg focus:ring-gray-500 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={onChange}
                    className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm">
                    <option value="">None</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-4">
                <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={onChange}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="ml-2">Active</span>
                </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="black-button disabled:opacity-60">
                    {mode === "create" ? "Create Product" : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm text-gray-600 hover:scale-110 hover:text-gray-900 duration-300">
                    Cancel
                </button>
            </div>
        </form>
    )
}

