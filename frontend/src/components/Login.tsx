import LoginForm from "./LoginForm"
import Breadcrumbs from "./Breadcrumbs"
import { useAuthStore } from "../store/authStore"
import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

export default function Login() {
    const { login, isLoading, error } = useAuthStore()
    const [loginError, setLoginError] = useState<string | null>(null)

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const handleLogin = async (formData: {
        email: string
        password: string
    }) => {
        setLoginError(null)
        const result = await login(formData.email, formData.password)

        if (result.success) {
            // Navigate to where user came from, or to profile if no previous location
            navigate(from !== "/login" ? from : "/profile", { replace: true })
        } else {
            setLoginError(result.message || "Login failed")
        }
    }

    // Show loading overlay when logging in
    if (isLoading) {
        return (
            <div>
                <Breadcrumbs />
                <div className="py-20">
                    <div className="w-[400px] block mx-auto">
                        <h2 className="text-center text-3xl mb-5 font-semibold">
                            Login to your account
                        </h2>
                        <LoadingSpinner text="Logging in..." />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Breadcrumbs />

            <div className="py-20">
                <div className="w-[400px] block mx-auto">
                    <h2 className="text-center text-3xl mb-5 font-semibold">
                        Login to your account
                    </h2>

                    <LoginForm
                        onSubmit={handleLogin}
                        isLoading={isLoading}
                        isSuccess={false}
                    />
                </div>

                {(loginError || error) && (
                    <div className="w-[400px] mx-auto mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                        ⚠ {loginError || error || "Login failed"}
                    </div>
                )}

                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-gray-900 hover:text-gray-700 underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
