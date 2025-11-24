// src/store/useAuthStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import AuthApi from "../apiCalls/authApi"
import type { User } from "../types/user"

const authApi = new AuthApi()

type Nullable<T> = T | null

interface AuthState {
    user: Nullable<User>
    accessToken: Nullable<string>
    isAuthenticated: boolean
    isLoading: boolean
    error: Nullable<string>

    // actions
    setUser: (user: Nullable<User>) => void
    setAccessToken: (token: Nullable<string>) => void
    clearAuth: () => void

    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; message?: string; user?: User }>
    logout: () => Promise<{ success: boolean; message?: string }>
    refresh: () => Promise<boolean>
    initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => {
                set({ user, isAuthenticated: !!user, error: null })
            },

            setAccessToken: (token) => {
                if (token) {
                    localStorage.setItem("accessToken", token)
                    set({ accessToken: token })
                } else {
                    localStorage.removeItem("accessToken")
                    set({ accessToken: null })
                }
            },

            clearAuth: () => {
                localStorage.removeItem("accessToken")
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                })
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const res = await authApi.login(email, password)
                    // expected res: { success: true, accessToken, user }
                    if (res?.success && res?.accessToken) {
                        // Store token first
                        localStorage.setItem("accessToken", res.accessToken)

                        // Set initial auth state with minimal user data from login
                        set({
                            user: res.user ?? null,
                            accessToken: res.accessToken,
                            isAuthenticated: true,
                            isLoading: true, // Keep loading while fetching full profile
                            error: null,
                        })

                        // Fetch full profile to get complete user data
                        try {
                            const profile = await authApi.getProfile()
                            set({
                                user: profile?.user ?? res.user ?? null,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                            })
                        } catch (profileErr) {
                            // If profile fetch fails, still keep the login state
                            // User can still use the app with minimal user data
                            console.warn(
                                "Failed to fetch profile after login:",
                                profileErr
                            )
                            set({
                                isLoading: false,
                                error: null,
                            })
                        }

                        return { success: true, user: res.user }
                    } else {
                        set({
                            isLoading: false,
                            error: res?.message ?? "Login failed",
                        })
                        return {
                            success: false,
                            message: res?.message || "Login failed",
                        }
                    }
                } catch (err: any) {
                    const msg = err?.message || err?.error || "Login error"
                    set({ isLoading: false, error: msg })
                    return { success: false, message: msg }
                }
            },

            logout: async () => {
                set({ isLoading: true })
                try {
                    await authApi.logout() // clears refresh cookie server-side
                } catch (err) {
                    // ignore errors: we will clear local state anyway
                    console.warn("Logout API error:", err)
                } finally {
                    get().clearAuth()
                    return { success: true, message: "Logged out" }
                }
            },

            refresh: async () => {
                try {
                    const res = await authApi.refresh() // { accessToken }
                    if (res?.accessToken) {
                        // update both localStorage and store
                        localStorage.setItem("accessToken", res.accessToken)
                        set({ accessToken: res.accessToken })
                        return true
                    }
                    return false
                } catch (err) {
                    get().clearAuth()
                    return false
                }
            },

            initAuth: async () => {
                const state = get()

                // If already authenticated with a token, just verify it's still valid
                if (state.isAuthenticated && state.accessToken) {
                    // Check if we have a user, if not fetch profile
                    if (!state.user) {
                        set({ isLoading: true })
                        try {
                            const profile = await authApi.getProfile()
                            set({
                                user: profile?.user ?? null,
                                isAuthenticated: !!profile?.user,
                                isLoading: false,
                                error: null,
                            })
                        } catch (err) {
                            console.error(
                                "initAuth: Failed to fetch profile:",
                                err
                            )
                            // Try refresh if profile fetch fails
                            const didRefresh = await get().refresh()
                            if (!didRefresh) {
                                get().clearAuth()
                            }
                            set({ isLoading: false })
                        }
                    } else {
                        // Already have user, just verify token is still valid
                        set({ isLoading: false })
                    }
                    return
                }

                // Not authenticated, try to restore from refresh token
                set({ isLoading: true, error: null })
                try {
                    // 1) try refresh (uses refresh cookie)
                    const didRefresh = await get().refresh()
                    if (!didRefresh) {
                        set({ isLoading: false })
                        return
                    }

                    // 2) if refresh succeeded, fetch profile
                    const profile = await authApi.getProfile() // expects { user, permissions... }
                    set({
                        user: profile?.user ?? null,
                        isAuthenticated: !!profile?.user,
                        isLoading: false,
                        error: null,
                    })
                } catch (err) {
                    console.error("initAuth error:", err)
                    get().clearAuth()
                } finally {
                    set({ isLoading: false })
                }
            },
        }),
        {
            name: "auth-storage",
            // persist only these keys to localStorage
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export default useAuthStore
