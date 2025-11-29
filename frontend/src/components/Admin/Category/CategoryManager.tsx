import React, { useState } from "react"
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "../../../types/category"
import LoadingSpinner from "../../LoadingSpinner"
import { CategoryForm, type CategoryFormState } from "./CategoryForm"
import { CategoryList } from "./CategoryList"
import { useCategories } from "../../../hooks/useCategories"

type Mode = "list" | "create" | "edit"

export function CategoryManager() {
    const [formError, setFormError] = useState<string | null>(null)

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

    const {
        categories,
        isLoading,
        error: queryError,
        createCategory,
        isCreating,
        updateCategory,
        isUpdating,
    } = useCategories()

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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target
        const { name, value } = target

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setForm((prev: CategoryFormState) => ({
                ...prev,
                [name]: target.checked,
            }))
        } else if (name === "parent_id") {
            setForm((prev: CategoryFormState) => ({
                ...prev,
                parent_id: value || null,
            }))
        } else {
            setForm((prev: CategoryFormState) => ({ ...prev, [name]: value }))
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
        setFormError(null)
        try {
            if (mode === "create") {
                const payload: CreateCategoryDto = {
                    name: form.name,
                    slug: form.slug || undefined,
                    parent_id: form.parent_id ?? undefined,
                    is_featured: form.is_featured,
                    is_active: form.is_active,
                }
                await createCategory(payload)
            } else if (mode === "edit" && selectedCategory) {
                const payload: UpdateCategoryDto = {
                    name: form.name,
                    slug: form.slug || undefined,
                    parent_id: form.parent_id ?? undefined,
                    is_featured: form.is_featured,
                    is_active: form.is_active,
                }
                await updateCategory({
                    id: selectedCategory.category_id,
                    payload,
                })
            }

            setMode("list")
            resetForm()
        } catch (err: any) {
            setFormError(err?.message ?? "Failed to save category")
        }
    }

    const handleCancel = () => {
        setMode("list")
        resetForm()
    }

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
                        className="black-button">
                        + New Category
                    </button>
                )}
            </header>

            {(queryError || formError) && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {formError ||
                        (queryError instanceof Error
                            ? queryError.message
                            : "Something went wrong")}
                </div>
            )}

            {isLoading && mode === "list" ? (
                <div className="flex items-center justify-center py-10">
                    <LoadingSpinner text="" />
                </div>
            ) : null}

            {mode === "list" && !isLoading && (
                <CategoryList categories={categories} onEdit={openEdit} />
            )}

            {(mode === "create" || mode === "edit") && (
                <CategoryForm
                    mode={mode}
                    form={form}
                    categories={categories}
                    loading={mode === "create" ? isCreating : isUpdating}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}
