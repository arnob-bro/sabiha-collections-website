import type { Category } from "../../../types/category"

interface CategoryListProps {
    categories: Category[]
    onEdit: (category: Category) => void
}

export function CategoryList({ categories, onEdit }: CategoryListProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                            ID
                        </th>
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
                <tbody className="divide-y divide-gray-200">
                    {categories.map((cat) => {
                        const parentName =
                            cat.parent_id &&
                            categories.find(
                                (c) => c.category_id === cat.parent_id
                            )?.name

                        return (
                            <tr key={cat.category_id} className="shadow-sm">
                                <td className="px-4 py-2">
                                    <div className="font-medium text-gray-900">
                                        {cat.category_id}
                                    </div>
                                </td>
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
                                        onClick={() => onEdit(cat)}
                                        className="text-xs bg-gray-300 px-3 py-1 rounded font-medium text-gray-900 hover:bg-gray-400 duration-300">
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
    )
}
