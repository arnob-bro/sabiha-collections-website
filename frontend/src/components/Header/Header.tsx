import { Link } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import Navlinks from "@/components/Header/Navlinks"
import MobileNav from "@/components/Header/MobileNav"
import Search from "@/components/Header/Search"
import HeaderLinks from "@/components/Header/HeaderLinks"

export default function Navbar() {
    const { user, isAuthenticated } = useAuthStore()

    return (
        <div className="sticky top-0 z-90">
            <div className="flex items-center justify-between px-5 md:px-10 lg:px-32 py-2 bg-primary shadow-md">
                {/* Mobile View Menu & Search*/}
                <div className="md:hidden flex flex-row gap-4">
                    <MobileNav />
                    <Search />
                </div>

                {/* Middle Section - LOGO */}
                <div className="md:w-[130px] w-[100px] text-secondary active:scale-105 duration-75 cursor-pointer">
                    <Link to="/">
                        <img src="/sabiha-logo-cut.png" alt="logo" />
                    </Link>
                </div>

                {/* Right section for Desktop and Mobile View */}
                <HeaderLinks user={user} isAuthenticated={isAuthenticated} />
            </div>

            {/* Desktop view - Categories ribbon */}
            <div className="hidden md:block py-2 bg-white shadow-lg">
                <Navlinks />
            </div>
        </div>
    )
}
