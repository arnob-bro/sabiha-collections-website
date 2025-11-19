import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import Breadcrumbs from "../../../common/Breadcrumbs";

export default function Login() {
	return (
		<div className='md:px-72 px-0'>
			<Breadcrumbs />
			<div className='py-20 min-h-[610px]'>
				<div className='w-[400px] block mx-auto'>
					<h2 className='text-center text-3xl mb-5 font-semibold'>Log In</h2>
					<LoginForm />

					<div className='mt-4 text-center'>
						<span className='mr-2'>Don't have an account?</span>
						<Link
							to='/account/signup'
							className='text-blue-500 hover:underline'
						>
							Register now
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
