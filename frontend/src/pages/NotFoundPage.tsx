import { Link } from "react-router-dom";

export default function NotFoundPage() {
	return (
		<>
			<div className='h-dvh w-dvw flex items-center justify-center'>
				<div className='flex items-center flex-col gap-10 justify-center'>
					<h2 className='text-5xl'>404 NOT Found</h2>
					<Link to='/' className='hover:underline text-2xl'>
						Return to home
					</Link>
				</div>
			</div>
		</>
	);
}
