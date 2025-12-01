import type { AxiosInstance } from "axios"
import { api } from "@/apiCalls/api"

import type {
    CreateProductDto,
    CreateProductResponse,
    CreateVariantDto,
    CreateVariantResponse,
    ProductListResponse,
} from "@/types/product"

export default class ProductApi {
    private productApi: AxiosInstance
    private baseURL: string

    constructor(baseURL = import.meta.env.VITE_API_URL as string) {
        this.productApi = api
        this.baseURL = `${baseURL}/products`
    }

    //! GET /products
    async getAllProducts(): Promise<ProductListResponse> {
        try {
            const res = await this.productApi.get(this.baseURL)
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to fetch all products"
            )
        }
    }

    // ! POST /products (create)
    async createProduct(
        data: CreateProductDto
    ): Promise<CreateProductResponse> {
        try {
            const res = await this.productApi.post(`${this.baseURL}`, data)
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to create product"
            )
        }
    }

    async createVariant(
        data: CreateVariantDto
    ): Promise<CreateVariantResponse> {
        try {
            const res = await this.productApi.post(
                `${this.baseURL}/${data.product_id}`,
                data
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to create variant"
            )
        }
    }

    async uploadImage() {}
}
