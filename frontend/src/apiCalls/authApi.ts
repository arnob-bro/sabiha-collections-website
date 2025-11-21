// src/api/AuthApi.ts
import type { AxiosError, AxiosInstance } from "axios";
import { api } from "../lib/api";
import type { User } from "../types/user";
// import { ApiError } from "../types/api";

export default class AuthApi {
	private authApi: AxiosInstance;
	private baseURL: string;

	constructor(baseURL = import.meta.env.VITE_API_URL as string) {
		this.authApi = api;
		this.baseURL = `${baseURL}/auth`;
	}

	async signup(userDetails: User) {
		try {
			const response = await this.authApi.post(
				`${this.baseURL}/create-user`,
				userDetails
			);
			return response.data;
		} catch (err) {
			const error = err as AxiosError<unknown>;

			// If server sent a response (has status code)

			// safe fallback
			throw error?.response?.data ?? { error: "signup failed" };
		}
	}
}
