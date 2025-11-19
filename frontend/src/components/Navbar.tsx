import { CiSearch } from "react-icons/ci";
import { MdOutlinePerson } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import Ribbon from "./Ribbon";

export default function Navbar() {
	return (
		<div className=' sticky top-0 z-90'>
			<div className='flex items-center justify-between lg:px-72 px-20 py-4 bg-white shadow-md'>
				<div className='w-[130px]'>
					<Link to='/'>
						<img src='/amira-logo.avif' alt='logo' />
					</Link>
				</div>

				<div className='flex flex-row items-center gap-5'>
					<div className='flex flex-row items-center gap-1 text-black hover:text-amber-500 duration-300 cursor-pointer'>
						<CiSearch size={28} />
						Search
					</div>

					<Link
						to='/account'
						className='flex flex-row items-center gap-1 text-black hover:text-amber-500 duration-300 cursor-pointer'
					>
						<MdOutlinePerson size={28} />
						Account
					</Link>

					<Link
						to='/cart'
						className='flex flex-row items-center gap-1 text-black hover:text-amber-500 duration-300 cursor-pointer'
					>
						<TiShoppingCart size={28} />
						Cart
					</Link>
				</div>
			</div>

			{/* Nav ribbon */}
			<div className='py-2 bg-white'>
				<Ribbon />
			</div>
		</div>
	);
}
