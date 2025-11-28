import { NavLink } from "react-router-dom"

const baseItemClasses =
    "w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors"

export function AdminSidebar() {
    const getClasses = (isActive: boolean) =>
        `${baseItemClasses} ${
            isActive
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
        }`

    return (
        <aside className="w-56 shrink-0 border-r border-gray-200 bg-white">
            <div className="px-4 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold tracking-wide">
                    Admin Panel
                </h2>
            </div>

            <nav className="p-3 space-y-1 text-sm flex flex-col">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) => getClasses(isActive)}>
                    Overview
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={({ isActive }) => getClasses(isActive)}>
                    Categories
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({ isActive }) => getClasses(isActive)}>
                    Products
                </NavLink>
            </nav>
        </aside>
    )
}
