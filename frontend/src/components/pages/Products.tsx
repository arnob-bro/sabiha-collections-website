import Breadcrumbs from "../common/Breadcrumbs";
import Card from "../common/Card";

export default function Products() {
	return (
		<div className='lg:px-64 px-5 '>
			<Breadcrumbs />

			<div>
				{/* Category name */}
				<h1 className='text-3xl my-5'>Women's</h1>
				<div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5'>
					{[...Array(8)].map((_, i) => (
						<Card key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
