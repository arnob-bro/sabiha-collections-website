import React, { useEffect, useState } from "react"
import CategoryApi from "../../apiCalls/categoryApi"
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "../../types/category"
import LoadingSpinner from "../LoadingSpinner"

const categoryApi = new CategoryApi()

type Mode = "list" | "create" | "edit"

interface CategoryFormState {
    name: string
    slug: string
    parent_id: string | null
    is_featured: boolean
    is_active: boolean
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [mode, setMode] = useState<Mode>("list")
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    )
    const [form, setForm] = useState<CategoryFormState>({
        name: "",
        slug: "",
        parent_id: null,
        is_featured: false,
        is_active: false,
    })

    const resetForm = () => {
        setForm({
            name: "",
            slug: "",
            parent_id: null,
            is_featured: false,
            is_active: false,
        })
        setSelectedCategory(null)
    }

    const loadCategories = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await categoryApi.getAllCategories()
            setCategories(res.data)
        } catch (err: any) {
            setError(err.message ?? "Failed to load categories")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadCategories()
    }, [])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target

        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }))
        } else if (name === "parent_id") {
            setForm((prev) => ({ ...prev, parent_id: value || null }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const openCreate = () => {
        resetForm()
        setMode("create")
    }

    const openEdit = (category: Category) => {
        setSelectedCategory(category)
        setForm({
            name: category.name,
            slug: category.slug,
            parent_id: category.parent_id,
            is_featured: category.is_featured,
            is_active: category.is_active,
        })
        setMode("edit")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError(null)

            if (mode === "create") {
                const payload: CreateCategoryDto = {
                    name: form.name,
                    slug: form.slug || undefined,
                    parent_id: form.parent_id ?? undefined,
                    is_featured: form.is_featured,
                    is_active: form.is_active,
                }
                await categoryApi.createCategory(payload)
            } else if (mode === "edit" && selectedCategory) {
                const payload: UpdateCategoryDto = {
                    name: form.name,
                    slug: form.slug || undefined,
                    parent_id: form.parent_id ?? undefined,
                    is_featured: form.is_featured,
                    is_active: form.is_active,
                }
                await categoryApi.updateCategory(
                    selectedCategory.category_id,
                    payload
                )
            }

            await loadCategories()
            setMode("list")
            resetForm()
        } catch (err: any) {
            setError(err.message ?? "Failed to save category")
        } finally {
            setLoading(false)
        }
    }

    const renderForm = () => (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-xl bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Name *
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
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
                    onChange={handleInputChange}
                    placeholder="Optional – auto-generated from name if empty"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Parent Category
                </label>
                <select
                    name="parent_id"
                    value={form.parent_id ?? ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm">
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
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="ml-2">Featured</span>
                </label>

                <label className="inline-flex items-center text-sm text-gray-700">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="ml-2">Active</span>
                </label>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-60">
                    {mode === "create" ? "Create Category" : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMode("list")
                        resetForm()
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900">
                    Cancel
                </button>
            </div>
        </form>
    )

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold tracking-wide">
                        Category Management
                    </h1>
                    <p className="text-sm text-gray-500">
                        View, create and update product categories.
                    </p>
                </div>

                {mode === "list" && (
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                        + New Category
                    </button>
                )}
            </header>

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading && mode === "list" ? (
                <div className="flex items-center justify-center py-10">
                    <LoadingSpinner text="" />
                </div>
            ) : null}

            {mode === "list" && !loading && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Slug
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Parent
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Featured
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                    Active
                                </th>
                                <th className="px-4 py-2 text-right font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => {
                                const parentName =
                                    cat.parent_id &&
                                    categories.find(
                                        (c) => c.category_id === cat.parent_id
                                    )?.name

                                return (
                                    <tr key={cat.category_id}>
                                        <td className="px-4 py-2">
                                            <div className="font-medium text-gray-900">
                                                {cat.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {cat.slug}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {parentName ?? "—"}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {cat.is_featured ? "Yes" : "No"}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {cat.is_active ? "Yes" : "No"}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(cat)}
                                                className="text-xs font-medium text-gray-900 hover:underline">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}

                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-sm text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {(mode === "create" || mode === "edit") && renderForm()}
        </div>
    )
}
