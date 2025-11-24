import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

interface LoginFormProps {
	onSubmit: (data: {
		email: string;
		password: string;
	}) => void;
	isLoading: boolean;
	isSuccess: boolean;
}

export default function LoginForm({
	onSubmit,
	isLoading,
	isSuccess,
}: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		onSubmit({
			email,
			password,
		});

		if (isSuccess) {
			setEmail("");
			setPassword("");
			setRemember(false);
		}
	};

	return (
		<form className='space-y-5' onSubmit={handleSubmit}>
			{/* Email */}
			<div className='relative'>
				<MdOutlineMail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
				<input
					type='email'
					placeholder='Email address'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
					required
					className='w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100'
				/>
			</div>

			{/* Password */}
			<div className='relative'>
				<FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
				<input
					type={showPassword ? "text" : "password"}
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={isLoading}
					required
					className='w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100'
				/>

				<button
					type='button'
					onClick={() => setShowPassword(!showPassword)}
					className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500'
				>
					{showPassword ? <FaEyeSlash /> : <FaEye />}
				</button>
			</div>

			{/* Remember Me + Forgot Password */}
			<div className='flex items-center justify-between text-sm'>
				<label className='flex items-center gap-2 cursor-pointer select-none'>
					<input
						type='checkbox'
						checked={remember}
						onChange={(e) => setRemember(e.target.checked)}
						disabled={isLoading}
						className='w-4 h-4 rounded border-gray-300 focus:ring-indigo-400'
					/>
					<span className='text-gray-700'>Remember me</span>
				</label>

				<button
					type='button'
					className='text-indigo-600 hover:underline font-medium'
					onClick={() => {
						// handle forgot password modal/navigation later
					}}
				>
					Forgot password?
				</button>
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-black to-gray-800 cursor-pointer transition'
			>
				{isLoading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
}
