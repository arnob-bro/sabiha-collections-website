import { useProducts } from "@/hooks/useProducts"
import { ProductList } from "./ProductList"
import { useState } from "react"
import CreateProduct from "./CreateProduct"

type Mode = "list" | "create" | "update"

export default function ProductManager() {
    const { products, pagination } = useProducts()

    const [mode, setMode] = useState<Mode>("list")

    return (
        <div>
            <div className="flex flex-row justify-between items-center">
                <div className="space-y-2 mb-5">
                    <h1 className="text-xl font-semibold tracking-wide">
                        Product Management
                    </h1>
                    <p className="text-sm text-gray-500">Manage products.</p>
                </div>

                <div>
                    <button
                        className="black-button hover:outline-none my-3"
                        onClick={() =>
                            mode === "create"
                                ? setMode("list")
                                : setMode("create")
                        }>
                        Create A Product
                    </button>
                </div>
            </div>

            {mode === "list" && <ProductList products={products} />}
            {mode === "create" && <CreateProduct />}
        </div>
    )
}
