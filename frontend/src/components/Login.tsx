import LoginForm from "./LoginForm";
import Breadcrumbs from "./Breadcrumbs";

export default function Login() {
	return (
		<div>
			<Breadcrumbs />
			<div className='px-5 sm:px-10 md:px-32 py-20 min-h-[610px]'>
				<div className='w-[400px] block mx-auto'>
					<h2 className='text-center text-3xl mb-5 font-semibold'>Log In</h2>
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
