// import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom";

export default function Ribbon() {
	return (
		<nav className='flex gap-10 mx-auto w-fit'>
			<Link to='/products' className='hover:text-amber-500 duration-300'>
				Men
			</Link>
			<Link to='/products' className='hover:text-amber-500 duration-300'>
				Women
			</Link>
			<Link to='/products' className='hover:text-amber-500 duration-300'>
				Kids
			</Link>
			<Link to='/products' className='hover:text-amber-500 duration-300'>
				New Arrivals
			</Link>
		</nav>
	);
}
