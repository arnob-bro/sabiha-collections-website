import { Link } from "react-router-dom"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { useCategoryTree } from "@/hooks/useCategories"

export default function Navlinks() {
    const { categoryTree, isLoading } = useCategoryTree()

    if (isLoading)
        return (
            <nav className="flex gap-10 mx-auto w-fit font-bold tracking-wider">
                <span className="text-gray-400">Loading...</span>
            </nav>
        )

    const activeCategories = categoryTree.filter((c) => c.is_active)

    return (
        <NavigationMenu.Root className="relative z-50 flex justify-center">
            <NavigationMenu.List className="flex gap-10">
                {activeCategories.map((cat) => (
                    <NavigationMenu.Item key={cat.category_id}>
                        {/* TRIGGER */}
                        <NavigationMenu.Trigger className="uppercase tracking-wider text-md font-semibold cursor-pointer text-gray-600 hover:text-amber-500 duration-300">
                            {cat.name}
                        </NavigationMenu.Trigger>

                        {/* DROPDOWN PANEL */}
                        <NavigationMenu.Content
                            className="absolute left-1/2 top-full -translate-x-1/2 mt-4
              bg-white shadow-xl rounded-xl p-10 w-[80vw] min-h-[300px]
              border border-gray-200 duration-300">
                            <div className="grid grid-cols-4 gap-10">
                                {cat.children?.map((child) => (
                                    <div key={child.category_id}>
                                        <Link to="/products">
                                            <h3 className="font-semibold text-gray-800 mb-3">
                                                {child.name}
                                            </h3>
                                        </Link>

                                        <ul className="space-y-2">
                                            {(child.children || []).map(
                                                (sub) => (
                                                    <li key={sub.category_id}>
                                                        <Link
                                                            to={`/category/${sub.slug}`}
                                                            className="text-gray-600 hover:text-amber-600 duration-200">
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                ))}
            </NavigationMenu.List>

            {/* Viewport is required for Radix animation */}
            <NavigationMenu.Viewport className="absolute left-0 top-full w-full flex justify-center" />
        </NavigationMenu.Root>
    )
}
