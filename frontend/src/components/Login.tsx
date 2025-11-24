import LoginForm from "./LoginForm"
import Breadcrumbs from "./Breadcrumbs"
import { useAuthStore } from "../store/authStore"
import { useState } from "react"

export default function Login() {
    const { login, isLoading, error } = useAuthStore()
    const [loginError, setLoginError] = useState<string | null>(null)

    const handleLogin = async (formData: {
        email: string
        password: string
    }) => {
        setLoginError(null)
        const result = await login(formData.email, formData.password)
        if (!result.success) {
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
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                            <p className="text-gray-600">Logging in...</p>
                        </div>
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
            </div>
        </div>
    )
}
