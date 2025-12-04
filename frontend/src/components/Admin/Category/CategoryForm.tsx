import React from "react"
import type { Category } from "@/types/category"

export interface CategoryFormState {
    name: string
    slug: string
    parent_id: string | null
    is_featured: boolean
    is_active: boolean
}

interface CategoryFormProps {
    mode: "create" | "edit"
    form: CategoryFormState
    categories: Category[]
    loading: boolean
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
}

export function CategoryForm({
    mode,
    form,
    categories,
    loading,
    onChange,
    onSubmit,
    onCancel,
}: CategoryFormProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 max-w-xl bg-white p-4 rounded-lg border border-gray-200 shadow-md">
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
                    Parent Category
                </label>
                <select
                    name="parent_id"
                    value={form.parent_id ?? ""}
                    onChange={onChange}
                    className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm">
                    <option value="">None (root category)</option>
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
                        name="is_featured"
                        checked={form.is_featured}
                        onChange={onChange}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="ml-2">Featured</span>
                </label>

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

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="black-button disabled:opacity-60">
                    {mode === "create" ? "Create Category" : "Save Changes"}
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
