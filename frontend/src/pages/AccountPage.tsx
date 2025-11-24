import Header from "../components/Header"
import Footer from "../components/Footer"
import Login from "../components/Login"
import { useState, useEffect, useRef } from "react"
import Signup from "../components/Signup"
import Profile from "../components/profile/profile"
import { useAuthStore } from "../store/authStore"

export default function AccountPage() {
    const [showLogin, setShowLogin] = useState<boolean>(true)
    const { isAuthenticated, initAuth, isLoading, accessToken } = useAuthStore()
    const hasInitialized = useRef(false)
    const [isInitializing, setIsInitializing] = useState(true)

    // Initialize auth on mount (only once, check for existing session)
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true
            // Only call initAuth if we have a token but no user, or if we're not authenticated
            // This prevents unnecessary calls after login
            if (accessToken && !isAuthenticated) {
                initAuth().finally(() => setIsInitializing(false))
            } else if (!accessToken && !isAuthenticated) {
                // No token at all, try to restore from refresh token
                initAuth().finally(() => setIsInitializing(false))
            } else {
                // Already authenticated, no need to initialize
                setIsInitializing(false)
            }
        }
    }, [initAuth, accessToken, isAuthenticated])

    // Show loading state only during initial auth check (before we know auth status)
    // Once we know the auth status, show appropriate content even if loading (e.g., fetching profile)
    if (isInitializing || (isLoading && !isAuthenticated && !accessToken)) {
        return (
            <div>
                <Header />
                <div className="px-5 sm:px-10 md:px-32 min-h-[650px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    // If authenticated, show profile (even if loading - Profile component handles its own loading)
    if (isAuthenticated) {
        return (
            <div>
                <Header />
                <div className="px-5 sm:px-10 md:px-32 min-h-[650px]">
                    <Profile />
                </div>
                <Footer />
            </div>
        )
    }

    // Show login/signup toggle
    return (
        <div>
            <Header />

            <div className="px-5 sm:px-10 md:px-32 min-h-[650px]">
                {showLogin ? <Login /> : <Signup />}
            </div>

            <div className="text-center py-4">
                <button
                    onClick={() => setShowLogin(!showLogin)}
                    className="text-gray-600 hover:text-gray-900 underline">
                    {showLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Login"}
                </button>
            </div>

            <Footer />
        </div>
    )
}
