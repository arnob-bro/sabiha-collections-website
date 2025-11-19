// src/components/Footer.tsx
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className='bg-black text-gray-300 py-8 mt-10 px-72'>
			<div className='container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8'>
				<div>
					<h2 className='text-xl font-bold text-white'>AMIRA</h2>
					<p className='mt-2 text-sm text-gray-400'>
						AMIRÁ is not just another clothing brand, but an innovative brand
						inspired by the future of fashion and charmed by traditional colors,
						art and textures.
					</p>
				</div>

				{/* Quick Links */}
				<div>
					<h3 className='text-lg font-semibold text-white mb-3'>Quick Links</h3>
					<ul className='space-y-2 text-sm'>
						<li>
							<a href='#' className='hover:text-white'>
								Home
							</a>
						</li>
						<li>
							<a href='#' className='hover:text-white'>
								Shop
							</a>
						</li>
						<li>
							<a href='#' className='hover:text-white'>
								About Us
							</a>
						</li>
						<li>
							<a href='#' className='hover:text-white'>
								Contact
							</a>
						</li>
					</ul>
				</div>

				{/* Social Icons */}
				<div>
					<h3 className='text-lg font-semibold text-white mb-3'>Follow Us</h3>
					<div className='flex space-x-4 text-xl'>
						<a href='#' className='hover:text-blue-500'>
							<FaFacebook />
						</a>
						<a href='#' className='hover:text-pink-500'>
							<FaInstagram />
						</a>
						<a href='#' className='hover:text-sky-400'>
							<FaTwitter />
						</a>
						<a href='#' className='hover:text-gray-400'>
							<FaGithub />
						</a>
					</div>
				</div>
			</div>

			{/* Bottom Note */}
			<div className='border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400'>
				© {new Date().getFullYear()} Ismail AliF. All rights reserved.
			</div>
		</footer>
	);
}
