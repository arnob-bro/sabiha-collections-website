import React, { useState } from "react"
import type { Product, CreateProductDto } from "../../../types/product"
import LoadingSpinner from "../../LoadingSpinner"
import { ProductForm, type ProductFormState } from "./ProductForm"
import { ProductList } from "./ProductList"
import { useProducts } from "../../../hooks/useProducts"
import { useCategories } from "../../../hooks/useCategories"

type Mode = "list" | "create" | "edit"

export function ProductManager() {
    const [formError, setFormError] = useState<string | null>(null)

    const [mode, setMode] = useState<Mode>("list")
    // TODO: Use selectedProduct when implementing edit mode
    // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [form, setForm] = useState<ProductFormState>({
        name: "",
        slug: "",
        description: "",
        price: "",
        discount_price: "",
        is_active: false,
        category_id: "",
    })

    const {
        products,
        isLoading,
        error: queryError,
        createProduct,
        isCreating,
    } = useProducts()

    const { categories } = useCategories()

    const resetForm = () => {
        setForm({
            name: "",
            slug: "",
            description: "",
            price: "",
            discount_price: "",
            is_active: false,
            category_id: "",
        })
        // setSelectedProduct(null)
    }

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const target = e.target
        const { name, value } = target

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setForm((prev: ProductFormState) => ({
                ...prev,
                [name]: target.checked,
            }))
        } else {
            setForm((prev: ProductFormState) => ({ ...prev, [name]: value }))
        }
    }

    const openCreate = () => {
        resetForm()
        setMode("create")
    }

    const openEdit = (product: Product) => {
        // setSelectedProduct(product) // TODO: Use when implementing edit mode
        setForm({
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            price: product.price,
            discount_price: product.discount_price || "",
            is_active: product.is_active,
            category_id: product.category_id?.toString() || "",
        })
        setMode("edit")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)
        try {
            if (mode === "create") {
                const payload: CreateProductDto = {
                    name: form.name,
                    slug: form.slug.trim() || undefined,
                    description: form.description.trim() || undefined,
                    price: parseFloat(form.price),
                    discount_price: form.discount_price.trim()
                        ? parseFloat(form.discount_price)
                        : undefined,
                    is_active: form.is_active ?? false,
                    category_id: form.category_id
                        ? parseInt(form.category_id)
                        : undefined,
                }
                await createProduct(payload)
            }
            // TODO: Add edit mode when updateProduct is implemented
            // else if (mode === "edit" && selectedProduct) {
            //     const payload: UpdateProductDto = { ... }
            //     await updateProduct({ id: selectedProduct.product_id, payload })
            // }

            setMode("list")
            resetForm()
        } catch (err: any) {
            setFormError(err?.message ?? "Failed to save product")
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
                        Product Management
                    </h1>
                    <p className="text-sm text-gray-500">
                        View, create and update products.
                    </p>
                </div>

                {mode === "list" && (
                    <button
                        type="button"
                        onClick={openCreate}
                        className="black-button">
                        + New Product
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
                <ProductList products={products} onEdit={openEdit} />
            )}

            {(mode === "create" || mode === "edit") && (
                <ProductForm
                    mode={mode}
                    form={form}
                    categories={categories}
                    loading={mode === "create" ? isCreating : false}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}
