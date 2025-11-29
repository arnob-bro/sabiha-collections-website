import { useAuthStore } from "../../store/authStore"
import Breadcrumbs from "../Breadcrumbs"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthApi from "../../apiCalls/authApi"
import LoadingSpinner from "../LoadingSpinner"

const authApi = new AuthApi()

export default function Profile() {
    const { user, logout, setUser, isLoading: authLoading } = useAuthStore()
    const [profileData, setProfileData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // If we already have user data with all fields, we might not need to fetch
        // But we'll fetch anyway to get the latest data and permissions
        const fetchProfile = async () => {
            // If auth is still loading (e.g., during login), wait a bit
            if (authLoading) {
                return
            }

            try {
                const profile = await authApi.getProfile()
                setProfileData(profile)
                if (profile?.user) {
                    setUser(profile.user)
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [setUser, authLoading])

    const handleLogout = async () => {
        await logout()
        navigate("/login", { replace: true })
    }

    // Show loading if auth is loading or profile is loading
    if (authLoading || isLoading) {
        return (
            <div>
                <Breadcrumbs />
                <LoadingSpinner text="Loading profile..." />
            </div>
        )
    }

    const displayUser = profileData?.user || user

    return (
        <div>
            <Breadcrumbs />

            <div className="py-20">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-semibold mb-8">My Profile</h2>

                    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                        {/* User Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Email
                                </label>
                                <p className="text-lg text-gray-900 mt-1">
                                    {displayUser?.email || "N/A"}
                                </p>
                            </div>

                            {displayUser?.first_name && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        First Name
                                    </label>
                                    <p className="text-lg text-gray-900 mt-1">
                                        {displayUser.first_name}
                                    </p>
                                </div>
                            )}

                            {displayUser?.last_name && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Last Name
                                    </label>
                                    <p className="text-lg text-gray-900 mt-1">
                                        {displayUser.last_name}
                                    </p>
                                </div>
                            )}

                            {displayUser?.phone && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Phone
                                    </label>
                                    <p className="text-lg text-gray-900 mt-1">
                                        {displayUser.phone}
                                    </p>
                                </div>
                            )}

                            {displayUser?.role && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Role
                                    </label>
                                    <p className="text-lg text-gray-900 mt-1 capitalize">
                                        {displayUser.role}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
