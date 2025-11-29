import { BrowserRouter, Route, Routes } from "react-router-dom"
import Products from "./pages/ProductsPage"
import NotFoundPage from "./pages/NotFoundPage"
import CartPage from "./pages/CartPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProfilePage from "./pages/ProfilePage"
import RequireAuth from "./components/RequireAuth"
import AdminPage from "./pages/AdminPage"
import { CategoryManager } from "./components/Admin/Category/CategoryManager"
import { AdminDashboard } from "./components/Admin/AdminDashboard"
import { ProductManager } from "./components/Admin/Product/ProductManager"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/*//* Protected routes - require authentication */}
                <Route element={<RequireAuth />}>
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<CartPage />} />

                {/* //! Admin routes (wrap this in RequireAuth with Roles.admin later) */}
                <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="categories" element={<CategoryManager />} />
                    <Route path="products" element={<ProductManager />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}
