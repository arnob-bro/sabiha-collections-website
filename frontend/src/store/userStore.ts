import { create } from "zustand";
import { persist } from "zustand/middleware";
import AuthApi from "../apiCalls/authApi";

const authApi = new AuthApi();

const useUserStore = create(
	persist(
		(set, get) => ({
			// State
			user: null,
			accessToken: null,
			permissions: [],
			permissionCodes: [],
			isAuthenticated: false,
			isLoading: false,
			error: null,

			// Actions
			setUser: (user) => {
				set({
					user,
					isAuthenticated: !!user,
					error: null,
				});
			},

			setAccessToken: (token) => {
				set({ accessToken: token });
			},

			setPermissions: (permissions, permissionCodes) => {
				set({
					permissions: permissions || [],
					permissionCodes: permissionCodes || [],
				});
			},

			setLoading: (loading) => {
				set({ isLoading: loading });
			},

			setError: (error) => {
				set({ error });
			},

			// Login action
			login: async (email, password) => {
				set({ isLoading: true, error: null });

				try {
					const result = await authApi.login(email, password);
					console.log(result);

					if (result.success) {
						// setAccessToken(res.data.accessToken); // store in memory
						set({
							user: result.user,
							accessToken: result.accessToken,
							permissions: result.permissions || [],
							permissionCodes: result.permissionCodes || [],
							isAuthenticated: true,
							isLoading: false,
							error: null,
						});
						// console.log(result);
						return { success: true, user: result.user };
					} else {
						set({
							isLoading: false,
							error: result.message || "Login failed",
						});
						return { success: false, message: result.message };
					}
				} catch (error) {
					set({
						isLoading: false,
						error: error.message || "An error occurred during login",
					});
					return { success: false, message: error.message };
				}
			},

			// Logout action
			logout: async () => {
				set({ isLoading: true });

				try {
					const { user } = get();

					const result = await authApi.logout();
					// setAccessToken(null);
					return result;

					// If no API, treat as success
					return { success: true, message: "Logout successful (no API)" };
				} catch (error) {
					console.error("Logout error:", error);
					return { success: false, message: error.message || "Logout error" };
				} finally {
					// Clear state regardless of API call success
					set({
						user: null,
						accessToken: null,
						permissions: [],
						permissionCodes: [],
						isAuthenticated: false,
						isLoading: false,
						error: null,
					});
				}
			},

			refresh: async () => {
				try {
					const result = await authApi.refresh();
					// setAccessToken(result.accessToken);
					return true;
				} catch {
					set({
						user: null,
						accessToken: null,
						permissions: [],
						permissionCodes: [],
						isAuthenticated: false,
						isLoading: false,
						error: null,
					});
					return false;
				}
			},

			initAuth: async () => {
				try {
					set({ isLoading: true });

					// 1. Try refresh
					const result = await authApi.refresh();
					set({ accessToken: result.accessToken });

					// 2. Get profile
					const profile = await authApi.getProfile();

					set({
						user: profile.user,
						permissions: profile.permissions || [],
						permissionCodes: profile.permissionCodes || [],
						isAuthenticated: true, // ✅ FIXED
						isLoading: false,
						error: null,
					});
				} catch (err) {
					console.error("initAuth failed:", err);
					set({
						user: null,
						accessToken: null,
						permissions: [],
						permissionCodes: [],
						isAuthenticated: false, // make sure it’s false only if refresh fails
						isLoading: false,
						error: null,
					});
				}
			},

			// Validate session
			validateSession: async () => {
				const { accessToken } = get();

				if (!accessToken) {
					set({
						isAuthenticated: false,
						user: null,
						permissions: [],
						permissionCodes: [],
					});
					return false;
				}

				try {
					if (!window.posAPI || !window.posAPI.validateSession) {
						// If no validation API, assume token is valid if it exists
						return !!accessToken;
					}

					const result = await window.posAPI.validateSession(accessToken);

					if (result.success) {
						set({
							user: result.user,
							permissions: result.permissions || [],
							permissionCodes: result.permissionCodes || [],
							isAuthenticated: true,
							error: null,
						});
						return true;
					} else {
						set({
							user: null,
							accessToken: null,
							permissions: [],
							permissionCodes: [],
							isAuthenticated: false,
							error: result.message,
						});
						return false;
					}
				} catch (error) {
					set({
						user: null,
						accessToken: null,
						permissions: [],
						permissionCodes: [],
						isAuthenticated: false,
						error: error.message,
					});
					return false;
				}
			},

			// Update user data
			updateUser: (userData) => {
				set((state) => ({
					user: { ...state.user, ...userData },
				}));
			},

			// Clear error
			clearError: () => {
				set({ error: null });
			},

			// Permission checking methods
			hasPermission: (permissionIndex) => {
				const { permissions } = get();
				return permissions[permissionIndex] === true;
			},

			hasPermissionByCode: (permissionCode) => {
				const { permissions, permissionCodes } = get();
				const index = permissionCodes.indexOf(permissionCode);
				return index !== -1 && permissions[index] === true;
			},

			hasAnyPermission: (permissionCodes) => {
				const { permissions, permissionCodes: codes } = get();
				return permissionCodes.some((code) => {
					const index = codes.indexOf(code);
					return index !== -1 && permissions[index] === true;
				});
			},

			hasAllPermissions: (permissionCodes) => {
				const { permissions, permissionCodes: codes } = get();
				return permissionCodes.every((code) => {
					const index = codes.indexOf(code);
					return index !== -1 && permissions[index] === true;
				});
			},
		}),
		{
			name: "user-storage", // unique name for localStorage key
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				permissions: state.permissions,
				permissionCodes: state.permissionCodes,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);

export default useUserStore;
