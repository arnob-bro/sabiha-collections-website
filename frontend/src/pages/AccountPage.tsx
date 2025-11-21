import Header from "../components/Header";
import Footer from "../components/Footer";
import Login from "../components/Login";
import { useState } from "react";
import Signup from "../components/Signup";

export default function AccountPage() {
	const [showLogin, setShowLogin] = useState<boolean>(true);

	return (
		<div>
			<Header />

			<div className='px-5 sm:px-10 md:px-32 min-h-[650px]'>
				{showLogin ? <Login /> : <Signup />}
			</div>

			{/* ADD A SLIDER HERE */}
			<button
				onClick={() => setShowLogin(!showLogin)}
				className='bg-black hover:bg-gray-800 duration-100 text-white px-5 py-2 rounded mx-auto block'
			>
				TOGGLE
			</button>
			{/* <div className='mt-4 text-center'>
				<span className='mr-2'>Don't have an account?</span>
				<button
					onClick={() => setShowLogin(!showLogin)}
					className='text-blue-500 hover:underline'
				>
					Register now
				</button>
			</div> */}
			<Footer />
		</div>
	);
}
