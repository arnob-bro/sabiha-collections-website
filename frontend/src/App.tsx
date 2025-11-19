import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import Login from "./components/pages/Account/Login/Login";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Signup from "./components/pages/Account/Signup/Signup";
// import LoginPage from "./components/Account/Login/LoginPage"
// import Account from "./components/Account/Account"

export default function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/products' element={<Products />} />
				<Route path='/account/login' element={<Login />} />
				<Route path='/account/signup' element={<Signup />} />

				{/* account e gele account/login e pathabe for now*/}
				<Route
					path='/account'
					element={<Navigate to='/account/login' replace />}
				/>

				<Route
					path='/cart'
					element={
						<div className='p-8 text-center'>
							<h1 className='text-2xl font-bold'>Cart Page</h1>
							<p>Your cart items will appear here.</p>
						</div>
					}
				/>
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}
