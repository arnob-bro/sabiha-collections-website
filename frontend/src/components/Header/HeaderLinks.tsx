import { Roles, type User } from "@/types/user"
import { CiSearch } from "react-icons/ci"
import { MdOutlinePerson } from "react-icons/md"
import { TiShoppingCart } from "react-icons/ti"
import { Link } from "react-router-dom"
import { HiOutlineWrench } from "react-icons/hi2"

export default function HeaderLinks({
    user,
    isAuthenticated,
}: {
    user: User | null
    isAuthenticated: boolean
}) {
    return (
        <>
            {/* mobile view*/}
            <div className="md:hidden flex flex-row gap-4">
                <Link
                    to={isAuthenticated ? "/profile" : "/login"}
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
                    to={isAuthenticated ? "/profile" : "/login"}
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

                {user?.role.includes(Roles.admin) && (
                    <Link
                        to="/admin"
                        className="flex flex-row items-center gap-1 text-secondary hover:text-amber-500 duration-300 cursor-pointer">
                        <HiOutlineWrench size={24} />
                        Admin
                    </Link>
                )}
            </div>
        </>
    )
}
