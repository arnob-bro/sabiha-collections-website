import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaGoogle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

export default function LoginForm() {
	const [mode, setMode] = useState<"login" | "register">("login");
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<form className='space-y-5'>
			<div className='relative'>
				<MdOutlineMail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
				<input
					id='email-input'
					type='email'
					placeholder='Email address'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
					required
					className='w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100'
				/>
			</div>

			<div className='relative'>
				<FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
				<input
					id='password-input'
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

			<div
				className={`grid transition-all duration-300 ${
					mode === "register"
						? "grid-rows-[1fr] opacity-100 translate-y-0"
						: "grid-rows-[0fr] opacity-0 -translate-y-1"
				}`}
			>
				<div className='overflow-hidden'>
					<div className='relative'>
						<FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
						<input
							id='confirm-password-input'
							type={showPassword ? "text" : "password"}
							placeholder='Confirm password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={isLoading || mode !== "register"}
							className='w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100'
						/>
					</div>
				</div>
			</div>

			<div className='flex items-center justify-between text-sm'>
				<label className='flex items-center gap-2 cursor-pointer text-gray-600'>
					<input
						type='checkbox'
						checked={rememberMe}
						onChange={() => setRememberMe(!rememberMe)}
						className='w-4 h-4 accent-indigo-500'
					/>
					{"Remember me"}
				</label>

				<button
					type='button'
					onClick={() => setError("Password reset flow not implemented.")}
					className='text-indigo-600 hover:underline'
					disabled={isLoading}
				>
					Forgot password?
				</button>
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 cursor-pointer  transition '
			>
				{isLoading ? "Signing in..." : "Sign In"}
			</button>

			<div className='relative text-center'>
				<span className='px-3 py-1 bg-white/70 relative z-10 text-xs text-gray-400 rounded'>
					Or Continue With
				</span>
				<div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gray-200'></div>
			</div>

			<button
				type='button'
				// onClick={handleGoogle}
				disabled={isLoading}
				className='w-full py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition'
			>
				<FaGoogle className='text-red-500' />
				{isLoading ? "Please wait..." : "Sign in with Google"}
			</button>

			{error && (
				<div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm'>
					⚠ {error}
				</div>
			)}
		</form>
	);
}
