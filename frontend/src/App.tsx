import { BrowserRouter, Route, Routes } from "react-router-dom";
import Products from "./pages/ProductsPage";
import NotFoundPage from "./pages/NotFoundPage";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/products' element={<Products />} />
				{/* <Route path='/products:id' element={<DetailsPage />} /> */}
				<Route path='/account' element={<AccountPage />} />
				<Route path='/cart' element={<CartPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}
