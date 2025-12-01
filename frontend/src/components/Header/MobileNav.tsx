import { useState } from "react"
import { Link } from "react-router-dom"
import { useCategoryTree } from "@/hooks/useCategories"
import { HiMenu, HiX } from "react-icons/hi"
import { IoIosArrowDown } from "react-icons/io"
import { type CategoryTreeNode } from "@/types/category"

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const { categoryTree, isLoading } = useCategoryTree()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
        if (isOpen) setExpanded(new Set())
    }

    const toggleCategory = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const closeMenu = () => {
        setIsOpen(false)
        setExpanded(new Set())
    }

    const CategoryItem = ({
        category,
        level = 0,
    }: {
        category: CategoryTreeNode
        level?: number
    }) => {
        const hasChildren = category.children?.length > 0
        const isExpanded = expanded.has(category.category_id)
        const padding = level === 0 ? "py-4" : level === 1 ? "py-3" : "py-2"
        const textSize =
            level === 0
                ? "font-semibold uppercase tracking-wider"
                : level === 1
                ? "font-medium"
                : "text-sm"

        return (
            <li className="border-b border-gray-100">
                <div className={`flex items-center justify-between ${padding}`}>
                    {hasChildren ? (
                        <button
                            onClick={() => toggleCategory(category.category_id)}
                            className={`flex-1 text-left text-gray-800 hover:text-primary transition-colors ${textSize}`}>
                            {category.name}
                        </button>
                    ) : (
                        <Link
                            // TODO FIX THIS LATER
                            //! to={`/products/${category.slug}`}
                            to={`/products`}
                            onClick={closeMenu}
                            className={`flex-1 text-left text-gray-800 hover:text-primary transition-colors ${textSize}`}>
                            {category.name}
                        </Link>
                    )}
                    {hasChildren && (
                        <IoIosArrowDown
                            className={`ml-4 text-gray-600 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                            }`}
                        />
                    )}
                </div>
                {hasChildren && (
                    <ul
                        className={`overflow-hidden transition-all duration-300 ${
                            isExpanded ? "max-h-[2000px]" : "max-h-0"
                        }`}>
                        <div className="pl-4 pb-2 space-y-1">
                            {category.children.map((child) => (
                                <CategoryItem
                                    key={child.category_id}
                                    category={child}
                                    level={level + 1}
                                />
                            ))}
                        </div>
                    </ul>
                )}
            </li>
        )
    }

    return (
        <>
            {/* Menu button */}
            <button
                onClick={!isOpen ? toggleMenu : null}
                className="md:hidden w-8 h-8 flex items-center justify-center text-secondary z-50 relative"
                aria-label="Toggle menu">
                {!isOpen && <HiMenu size={28} />}
            </button>

            {/* Menu Open */}
            <div
                className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-primary">
                        Categories
                    </h2>
                    <button
                        onClick={toggleMenu}
                        className="text-gray-600 hover:text-primary transition-colors">
                        <HiX size={28} />
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-73px)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400">Loading...</span>
                        </div>
                    ) : (
                        <nav className="px-5 py-4">
                            <ul className="space-y-1">
                                {categoryTree
                                    .filter((c) => c.is_active)
                                    .map((category) => (
                                        <CategoryItem
                                            key={category.category_id}
                                            category={category}
                                        />
                                    ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </>
    )
}
