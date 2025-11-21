export interface Product {
	id: string;
	name: string;
	price: number;
	category: "men" | "women" | "kids";
	image: string;
	images?: string[];
	sizes: string[];
	stock: number;
	description?: string;
}

export interface CartItem extends Product {
	quantity: number;
	selectedSize: string;
}
