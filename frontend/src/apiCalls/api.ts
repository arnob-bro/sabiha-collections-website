import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true, // send cookies (refresh token)
});

// queue helpers to handle concurrent refreshes
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((p) => {
		if (error) p.reject(error);
		else p.resolve(token as string);
	});
	failedQueue = [];
};

// Attach access token from localStorage before every request
api.interceptors.request.use((config) => {
	try {
		const token = localStorage.getItem("accessToken");
		if (token && config && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	} catch (e) {
		// ignore
	}
	return config;
});

// Response interceptor to handle 401 -> try refresh -> retry original
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const originalRequest = err?.config;
		const status = err?.response?.status;

		if (status === 401 && !originalRequest?._retry) {
			if (isRefreshing) {
				// queue this request until refresh finishes
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((e) => Promise.reject(e));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// Use plain axios to avoid hitting this interceptor again
				const axiosPlain = (await import("axios")).default;
				const res = await axiosPlain.post(
					`${BASE_URL}/auth/refresh`,
					{}, // body can be empty
					{ withCredentials: true }
				);

				const newAccessToken = res?.data?.accessToken;
				if (newAccessToken) {
					// persist token for subsequent requests
					localStorage.setItem("accessToken", newAccessToken);
					processQueue(null, newAccessToken);

					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return api(originalRequest);
				} else {
					throw new Error("Refresh failed - no token");
				}
			} catch (refreshErr) {
				processQueue(refreshErr, null);
				// clear local token so app knows user is signed out
				localStorage.removeItem("accessToken");
				return Promise.reject(refreshErr);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(err);
	}
);
