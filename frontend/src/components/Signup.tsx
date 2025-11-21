import SignupForm from "./SignupForm";
import Breadcrumbs from "./Breadcrumbs";

import { useMutation } from "@tanstack/react-query";
import AuthApi from "../apiCalls/authApi";
import type { User } from "../types/user";

const authApi = new AuthApi();

export default function Signup() {
	const { mutate, isPending, error, isSuccess } = useMutation({
		mutationFn: (user: User) => authApi.signup(user),
		// eikhane onSuccess/onError anbo if i want navigation or toast
	});

	return (
		<div>
			<Breadcrumbs />
			<div className='py-20'>
				<div className='w-[400px] block mx-auto'>
					<h2 className='text-center text-3xl mb-5 font-semibold'>
						Create an account
					</h2>

					<SignupForm
						onSubmit={(formData) => mutate(formData)}
						isLoading={isPending}
						isSuccess={isSuccess}
					/>
				</div>

				{isSuccess && (
					<p className='mt-3 text-sm text-green-600'>Signup successful!</p>
				)}
				{error && (
					<div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm'>
						⚠ {error.message}
					</div>
				)}
			</div>
		</div>
	);
}
