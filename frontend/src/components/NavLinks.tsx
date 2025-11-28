// import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"

export default function NavLinks() {
    return (
        <nav className="flex gap-10 mx-auto w-fit font-bold tracking-wider">
            <Link
                to="/products"
                className="hover:text-amber-500 hover:scale-105 duration-300">
                Men
            </Link>
            <Link to="/products" className="hover:text-amber-500 duration-300">
                Women
            </Link>
            <Link to="/products" className="hover:text-amber-500 duration-300">
                Kids
            </Link>
            <Link to="/products" className="hover:text-amber-500 duration-300">
                New Arrivals
            </Link>
        </nav>
    )
}
