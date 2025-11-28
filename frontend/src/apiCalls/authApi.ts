// src/api/AuthApi.ts
import type { AxiosError, AxiosInstance } from "axios"
import { api } from "./api"
import type { User } from "../types/user"
// import { ApiError } from "../types/api";

export default class AuthApi {
    private authApi: AxiosInstance
    private baseURL: string

    constructor(baseURL = import.meta.env.VITE_API_URL as string) {
        this.authApi = api
        this.baseURL = `${baseURL}/auth`
    }

    async signup(userDetails: User) {
        try {
            const response = await this.authApi.post(
                `${this.baseURL}/create-user`,
                userDetails
            )
            return response.data
        } catch (err) {
            const error = err as AxiosError<unknown>

            // If server sent a response (has status code)

            // safe fallback
            throw error?.response?.data ?? { error: "signup failed" }
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await this.authApi.post(
                `${this.baseURL}/login`,
                {
                    email,
                    password,
                },
                { withCredentials: true } // important for cookies!
            )
            return response.data
        } catch (err) {
            const error = err as AxiosError<unknown>

            throw error?.response?.data ?? { error: "Login failed" }
        }
    }

    async logout() {
        try {
            const response = await this.authApi.post(`${this.baseURL}/logout`)
            return response.data
        } catch (err) {
            const error = err as AxiosError<unknown>
            throw error?.response?.data && { error: "Logout failed" }
        }
    }

    // call refresh endpoint — returns { accessToken: "..." }
    async refresh() {
        try {
            // Use the same base URL but with plain axios is okay; using authApi is also fine because interceptors handle token
            const response = await this.authApi.post(
                `${this.baseURL}/refresh`,
                {},
                { withCredentials: true }
            )
            return response.data
        } catch (err) {
            const error = err as AxiosError<unknown>
            throw error?.response?.data ?? { error: "Refresh failed" }
        }
    }

    // fetch profile. Backend expects Authorization header: Bearer <accessToken>
    async getProfile() {
        try {
            const response = await this.authApi.get(`${this.baseURL}/profile`)
            return response.data
        } catch (err) {
            const error = err as AxiosError<unknown>
            throw error?.response?.data ?? { error: "Profile fetch failed" }
        }
    }

    // async verifyNewPassToken(token) {
    // 	try {
    // 		const response = await this.authApi.get(
    // 			`${this.baseURL}/change-password/${token}`
    // 		);
    // 		return response.data; // { success: true/false, message: "..." }
    // 	} catch (err) {
    // 		throw err.response?.data || { error: "Token verification failed" };
    // 	}
    // }

    // /**
    //  * Change password using reset token
    //  */
    // async changePasswordWithToken(token, newPassword) {
    // 	try {
    // 		const response = await this.authApi.post(
    // 			`${this.baseURL}/change-password/${token}`,
    // 			{
    // 				new_password: newPassword,
    // 			}
    // 		);
    // 		return response.data; // { success: true, message: "...", user: {...} }
    // 	} catch (err) {
    // 		throw err.response?.data || { error: "Password change failed" };
    // 	}
    // }
}
