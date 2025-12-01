import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthApi from "@/apiCalls/authApi"
import LoadingSpinner from "@/components/LoadingSpinner"

const authApi = new AuthApi()

export default function Profile() {
    const { user, logout, setUser, isLoading: authLoading } = useAuthStore()
    const [profileData, setProfileData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
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

    if (authLoading || isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner text="Loading profile..." />
                </div>
            </div>
        )
    }

    const displayUser = profileData?.user || user

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8 max-w-6xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        My Profile
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        View and manage your account information
                    </p>
                </div>

                {/* Profile Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Email Address
                        </label>
                        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                            <p className="text-base text-gray-900 font-medium">
                                {displayUser?.email || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Role */}
                    {displayUser?.role && (
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Role
                            </label>
                            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="text-base text-gray-900 font-medium capitalize">
                                    {displayUser.role}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* First Name */}
                    {displayUser?.first_name && (
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                First Name
                            </label>
                            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="text-base text-gray-900 font-medium">
                                    {displayUser.first_name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Last Name */}
                    {displayUser?.last_name && (
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Last Name
                            </label>
                            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="text-base text-gray-900 font-medium">
                                    {displayUser.last_name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {displayUser?.phone && (
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Phone Number
                            </label>
                            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="text-base text-gray-900 font-medium">
                                    {displayUser.phone}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Logout Section */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Account Actions
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Sign out of your account
                            </p>
                        </div>
                        <button onClick={handleLogout} className="black-button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
