import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import Login from "./components/Account/Login/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./components/Account/Signup/Signup";
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
