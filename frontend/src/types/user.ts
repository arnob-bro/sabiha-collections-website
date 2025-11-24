export const Roles = {
	user: "user",
	admin: "admin",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface User {
	user_id?: number;
	first_name: string;
	last_name: string;
	email: string;
	password?: string; // Optional - only needed for signup, not returned from API
	role: Role;
	phone?: string; // Optional - may not be provided
}
