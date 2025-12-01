// components/CategoryDropdown.tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
// import { ChevronRight } from "lucide-react"

interface Category {
    id: string
    name: string
    subcategories?: { id: string; name: string }[]
}

interface Props {
    categories: Category[]
}

export default function CategoryDropdown({ categories }: Props) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition">
                    Categories
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                sideOffset={6}
                className="min-w-[220px] rounded-xl p-2 bg-white shadow-xl border border-gray-200 animate-in fade-in-80 zoom-in-95">
                {categories.map((cat) => (
                    <DropdownMenu.Sub key={cat.id}>
                        <DropdownMenu.SubTrigger className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-gray-800 hover:bg-gray-100 text-sm">
                            {cat.name}
                            {/* <ChevronRight className="w-4 h-4 opacity-50" /> */}
                        </DropdownMenu.SubTrigger>

                        <DropdownMenu.SubContent
                            sideOffset={8}
                            className="min-w-[200px] rounded-xl p-2 bg-white shadow-xl border border-gray-200 animate-in fade-in-80 zoom-in-95">
                            {cat.subcategories?.map((sub) => (
                                <DropdownMenu.Item
                                    key={sub.id}
                                    className="px-3 py-2 rounded-lg cursor-pointer text-gray-800 hover:bg-gray-100 text-sm">
                                    {sub.name}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}
