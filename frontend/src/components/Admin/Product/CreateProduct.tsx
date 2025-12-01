import ProductFormComponent from "./ProductFormComponent"

export default function CreateProduct() {
    const handleSubmit = async () => {}

    return (
        <div className="border border-gray-400">
            <ProductFormComponent onSubmit={handleSubmit} />
        </div>
    )
}
