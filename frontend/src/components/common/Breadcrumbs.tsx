import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
	const location = useLocation();

	// Split pathname into parts
	const pathnames = location.pathname.split("/").filter((x) => x);

	return (
		<nav className='text-sm my-4'>
			<ul className='flex gap-2 text-gray-600'>
				<li>
					<Link to='/' className='hover:underline text-bold'>
						Home
					</Link>
				</li>
				{pathnames.map((value, index) => {
					const to = "/" + pathnames.slice(0, index + 1).join(">");
					const isLast = index === pathnames.length - 1;
					return (
						<li key={to} className='flex items-center gap-2'>
							<span>{">"}</span>
							{isLast ? (
								<span className='text-gray-800'>
									{value.charAt(0).toUpperCase() + value.slice(1)}
								</span>
							) : (
								<Link to={to} className='hover:underline'>
									{value}
								</Link>
							)}
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
