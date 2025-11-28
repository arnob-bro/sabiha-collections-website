import SignupForm from "./SignupForm";
import Breadcrumbs from "./Breadcrumbs";
import { useMutation } from "@tanstack/react-query";
import AuthApi from "../apiCalls/authApi";
import type { User } from "../types/user";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const authApi = new AuthApi();

export default function Signup() {
	const [signupError, setSignupError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const navigate = useNavigate();

	const { mutate, isPending } = useMutation({
		mutationFn: (user: User) => authApi.signup(user),
		onSuccess: (data) => {
			if (data?.success) {
				setIsSuccess(true);
				setSignupError(null);
				// Redirect to login after a delay
				setTimeout(() => {
					navigate("/login", { replace: true });
				}, 2000);
			} else {
				setSignupError(data?.message || "Signup failed");
			}
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				error?.error ||
				"Signup failed. Please try again.";
			setSignupError(errorMessage);
			setIsSuccess(false);
		},
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
					<div className='w-[400px] mx-auto mt-3 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg'>
						✓ Signup successful! You can now login.
					</div>
				)}
				{signupError && (
					<div className='w-[400px] mx-auto mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm'>
						⚠ {signupError}
					</div>
				)}

				<div className="text-center mt-6">
					<p className="text-gray-600">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-gray-900 hover:text-gray-700 underline font-medium">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
