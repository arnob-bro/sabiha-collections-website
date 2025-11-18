import Breadcrumbs from "../Breadcrumbs";
import Card from "../Card";

export default function Products() {
	return (
		<div className='px-64 py-10 '>
			<Breadcrumbs />

			<div className='grid grid-cols-4 pt-5 gap-y-4'>
				<Card />
				<Card />
				<Card />
				<Card />
				<Card />
				<Card />
				<Card />
				<Card />
			</div>
		</div>
	);
}
