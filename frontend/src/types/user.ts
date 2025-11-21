export const Roles = {
	user: "USER",
	admin: "ADMIN",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface User {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role: Role;
	phone: string;
}
