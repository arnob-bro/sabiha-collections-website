import { CiSearch } from "react-icons/ci"
import { MdOutlinePerson } from "react-icons/md"
import { TiShoppingCart } from "react-icons/ti"
import { Link } from "react-router-dom"
import Ribbon from "./Ribbon"
import { useState } from "react"
import { FiMenu } from "react-icons/fi"
import { useAuthStore } from "../store/authStore"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const { user, isAuthenticated } = useAuthStore()

    return (
        <div className="sticky top-0 z-90">
            <div className="flex items-center justify-between px-5 md:px-10 lg:px-32 py-4 bg-primary shadow-md">
                {/* Left sEction */}
                <div className="md:hidden flex flex-row gap-4">
                    {/* menu hamburger for mobile view */}
                    <div className="">
                        <button
                            className="relative text-secondary active:scale-105 duration-75 cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}>
                            <FiMenu size={28} />
                        </button>

                        {menuOpen && (
                            <div className="absolute top-10 bg-zinc-400">
                                <ul className="flex flex-col">
                                    <li>
                                        <Link
                                            to="/products"
                                            className="text-secondary active:scale-105 duration-75 cursor-pointer">
                                            Men
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/products"
                                            className="text-secondary active:scale-105 duration-75 cursor-pointer">
                                            Women
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/products"
                                            className="text-secondary active:scale-105 duration-75 cursor-pointer">
                                            Kids
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/products"
                                            className="text-secondary active:scale-105 duration-75 cursor-pointer">
                                            New arrivals
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* search icon - mobile */}
                    <div>
                        <div className=" text-secondary active:scale-105 duration-75 cursor-pointer">
                            <CiSearch size={28} />
                        </div>
                    </div>
                </div>

                {/* Middle section - logo */}
                <div className="md:w-[130px] w-[100px] text-secondary active:scale-105 duration-75 cursor-pointer">
                    <Link to="/">
                        <img src="/sabiha-logo-cut.png" alt="logo" />
                    </Link>
                </div>

                {/* Right section for mobile view*/}
                <div className="md:hidden flex flex-row gap-4">
                    <Link
                        to="/account"
                        className=" text-secondary active:scale-105 duration-75 cursor-pointer relative"
                        title={
                            isAuthenticated && user?.first_name
                                ? `Logged in as ${user.first_name}`
                                : "Account"
                        }>
                        <MdOutlinePerson size={28} />
                        {isAuthenticated && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                    </Link>

                    <Link
                        to="/cart"
                        className=" text-secondary active:scale-105 duration-75 cursor-pointer">
                        <TiShoppingCart size={28} />
                    </Link>
                </div>

                {/* big screen links */}
                <div className="md:flex hidden flex-row items-center gap-5">
                    <div className="flex flex-row items-center gap-1 text-secondary hover:text-amber-500 duration-300 cursor-pointer">
                        <CiSearch size={28} />
                        Search
                    </div>

                    <Link
                        to="/account"
                        className="flex flex-row items-center gap-1 text-secondary hover:text-amber-500 duration-300 cursor-pointer">
                        <MdOutlinePerson size={28} />
                        {isAuthenticated && user?.first_name
                            ? user.first_name
                            : "Account"}
                    </Link>

                    <Link
                        to="/cart"
                        className="flex flex-row items-center gap-1 text-secondary hover:text-amber-500 duration-300 cursor-pointer">
                        <TiShoppingCart size={28} />
                        Cart
                    </Link>
                </div>
            </div>

            {/* Desktop view - Nav ribbon */}
            <div className="hidden md:block py-2 bg-white">
                <Ribbon />
            </div>
        </div>
    )
}
