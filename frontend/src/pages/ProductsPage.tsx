import Header from "../components/Header";
import Footer from "../components/Footer";

import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
	return (
		<>
			<Header />
			<div className='lg:px-64 px-5 '>
				<Breadcrumbs />

				<div>
					{/* Category name */}
					<h1 className='text-3xl my-5'>Women's</h1>
					<div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5'>
						{[...Array(8)].map((_, i) => (
							<ProductCard key={i} />
						))}
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}
