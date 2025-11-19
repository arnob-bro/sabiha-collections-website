export default function Card() {
	return (
		<div className=''>
			{/* image section */}
			<div className='relative w-fit group'>
				{/* Badge */}
				<div className='absolute top-2 -right-2 z-5 bg-red-600 text-center text-md px-2 text-white rounded shadow-md'>
					70% Off
				</div>
				{/* image */}
				<div className='relative w-72 h-[450px] overflow-hidden rounded-xl shadow-xl'>
					{/* frontside image */}
					<img
						className='absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0'
						src='https://amirabd.com/wp-content/uploads/2025/09/DSC05841-1000x1500.jpg'
						alt='card-image-1'
					/>
					{/* backside image */}
					<img
						className='absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100'
						src='https://amirabd.com/wp-content/uploads/2025/09/DSC05846-600x900.jpg'
						alt='card-image-2'
					/>
				</div>
			</div>
			{/* Text section */}
			<div className='px-2'>
				<h3 className='text-lg mt-5'>Baler kameez</h3>
				<div className='flex flex-row gap-2'>
					<p>৳ 4,260</p>
					<p className='line-through text-red-500'>৳ 5,199</p>
				</div>
				<button className='w-full bg-amber-600 text-white py-2 my-2 rounded hover:bg-amber-700 duration-300 cursor-pointer'>
					Add to Cart
				</button>
			</div>
		</div>
	);
}
