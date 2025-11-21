import Header from "../components/Header";
import Footer from "../components/Footer";
import { mockProducts } from "../data/mockProducts";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
	const featuredProducts: Product[] = mockProducts.slice(0, 4);

	return (
		<div className='min-h-screen bg-background'>
			<Header />

			{/* Hero Section */}
			<section className='relative h-[500px] md:h-[600px] overflow-hidden text-white'>
				<div
					className='absolute inset-0 bg-cover bg-center'
					style={{
						backgroundImage:
							"url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80)",
					}}
				>
					<div className='absolute inset-0 bg-gradient-to-r from-background/90 to-background/50' />
				</div>

				<div className='relative container mx-auto px-4 h-full flex items-center'>
					<div className='max-w-xl space-y-6'>
						<h1 className='text-4xl md:text-6xl font-bold text-foreground'>
							New Season Collection
						</h1>
						<p className='text-lg text-muted-foreground'>
							Discover the latest trends in fashion. Quality clothing for
							everyone.
						</p>
						<div className='flex gap-4'>
							<button>
								<Link to='/category/women'>Shop Women</Link>
							</button>
							<button>
								<Link to='/category/men'>Shop Men</Link>
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Free Delivery Banner */}
			<section className='bg-primary text-primary-foreground py-4'>
				<div className='container mx-auto px-4 text-center'>
					<p className='font-medium'>🎉 Free Delivery on Orders Over ৳1499</p>
				</div>
			</section>

			{/* Featured Products */}
			<section className='container mx-auto px-4 py-16'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold mb-4'>Featured Products</h2>
					<p className='text-muted-foreground'>Check out our latest arrivals</p>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{featuredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				<div className='text-center mt-12'>
					<button>
						<Link to='/category/women'>View All Products</Link>
					</button>
				</div>
			</section>

			{/* Categories */}
			<section className='bg-secondary py-16'>
				<div className='container mx-auto px-4'>
					<div className='grid md:grid-cols-3 gap-6'>
						{[
							{
								name: "Men",
								image:
									"https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80",
								link: "/category/men",
							},
							{
								name: "Women",
								image:
									"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
								link: "/category/women",
							},
							{
								name: "Kids",
								image:
									"https://images.unsplash.com/photo-1503919436766-e8de0a13ad42?w=600&q=80",
								link: "/category/kids",
							},
						].map((category) => (
							<Link
								key={category.name}
								to={category.link}
								className='group relative overflow-hidden rounded-lg aspect-[4/5] block'
							>
								<img
									src={category.image}
									alt={category.name}
									className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-8'>
									<h3 className='text-2xl font-bold text-foreground'>
										{category.name}
									</h3>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<Footer className='border-t py-12'>
				<div className='container mx-auto px-4'>
					<div className='grid md:grid-cols-4 gap-8'>
						<div>
							<h3 className='font-bold text-lg mb-4'>About Sabiha</h3>
							<p className='text-sm text-muted-foreground'>
								Your trusted destination for quality clothing in Bangladesh.
							</p>
						</div>
						<div>
							<h3 className='font-bold text-lg mb-4'>Shop</h3>
							<ul className='space-y-2 text-sm text-muted-foreground'>
								<li>
									<Link to='/category/men' className='hover:text-primary'>
										Men
									</Link>
								</li>
								<li>
									<Link to='/category/women' className='hover:text-primary'>
										Women
									</Link>
								</li>
								<li>
									<Link to='/category/kids' className='hover:text-primary'>
										Kids
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className='font-bold text-lg mb-4'>Help</h3>
							<ul className='space-y-2 text-sm text-muted-foreground'>
								<li>
									<Link to='/contact' className='hover:text-primary'>
										Contact
									</Link>
								</li>
								<li>
									<Link to='/about' className='hover:text-primary'>
										About
									</Link>
								</li>
								<li>
									<Link to='/policy' className='hover:text-primary'>
										Delivery & Returns
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className='font-bold text-lg mb-4'>Account</h3>
							<ul className='space-y-2 text-sm text-muted-foreground'>
								<li>
									<Link to='/account' className='hover:text-primary'>
										My Account
									</Link>
								</li>
								<li>
									<Link to='/cart' className='hover:text-primary'>
										Cart
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className='border-t mt-8 pt-8 text-center text-sm text-muted-foreground'>
						<p>&copy; 2024 Sabiha. All rights reserved.</p>
					</div>
				</div>
			</Footer>
		</div>
	);
}
