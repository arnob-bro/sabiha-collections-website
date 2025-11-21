import { type Product } from "../types/product";

export const mockProducts: Product[] = [
	{
		id: "1",
		name: "Classic Cotton Shirt",
		price: 1299,
		category: "men",
		image:
			"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
		images: [
			"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
			"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
		],
		sizes: ["S", "M", "L", "XL"],
		stock: 15,
		description:
			"Premium cotton shirt with classic fit. Perfect for everyday wear.",
	},
	{
		id: "2",
		name: "Casual Denim Jeans",
		price: 1899,
		category: "men",
		image:
			"https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
		sizes: ["30", "32", "34", "36"],
		stock: 20,
		description: "Comfortable stretch denim with modern slim fit.",
	},
	{
		id: "3",
		name: "Elegant Summer Dress",
		price: 2299,
		category: "women",
		image:
			"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
		sizes: ["XS", "S", "M", "L"],
		stock: 12,
		description: "Flowing summer dress in lightweight fabric.",
	},
	{
		id: "4",
		name: "Floral Print Top",
		price: 999,
		category: "women",
		image:
			"https://images.unsplash.com/photo-1564257631407-a2d1d7254e1e?w=500&q=80",
		sizes: ["S", "M", "L", "XL"],
		stock: 18,
		description: "Beautiful floral print with comfortable cotton blend.",
	},
	{
		id: "5",
		name: "Kids Cotton T-Shirt",
		price: 599,
		category: "kids",
		image:
			"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80",
		sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
		stock: 25,
		description: "Soft cotton tee for active kids.",
	},
	{
		id: "6",
		name: "Kids Denim Shorts",
		price: 799,
		category: "kids",
		image:
			"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80",
		sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
		stock: 20,
		description: "Durable denim shorts for everyday play.",
	},
];
