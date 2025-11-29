import type { AxiosInstance } from "axios"
import type { ApiResponse } from "@/types/api"
import { api } from "@/apiCalls/api"

import type { Product } from "@/types/product"

export default class ProductApi {
    private productApi: AxiosInstance
    private baseURL: string

    constructor(baseURL = import.meta.env.VITE_API_URL as string) {
        this.productApi = api
        this.baseURL = `${baseURL}/products`
    }

    // GET /categories/all (flat list)
    async getProducts(): Promise<ApiResponse<Product[]>> {
        try {
            const res = await this.productApi.get<ApiResponse<Product[]>>(
                this.baseURL
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to fetch all products"
            )
        }
    }

    // POST /categories (create)
    async createProduct(data: Product): Promise<ApiResponse<Product>> {
        try {
            const res = await this.productApi.post<ApiResponse<Product>>(
                `${this.baseURL}`,
                data
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to create category"
            )
        }
    }
}
