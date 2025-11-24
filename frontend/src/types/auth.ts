import type { User } from "./user";

export interface AuthState {
	user: User | null;
	accessToken: string | null;
	isLoggedIn: boolean;

	setUser: (users: User) => void;
	setAccessToken: (token: string) => void;
	logout: () => void;
}
