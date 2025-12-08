import type { AxiosInstance } from "axios"
import { api } from "@/apiCalls/api"

import type {
    CreateProductDto,
    CreateProductResponse,
    CreateVariantDto,
    CreateVariantResponse,
    ProductListResponse,
} from "@/types/product"

type UploadVariantImagePayload = {
    file: File
    is_featured_one: boolean
    is_featured_two: boolean
}

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
        productId: string,
        data: Omit<CreateVariantDto, "product_id">
    ): Promise<CreateVariantResponse> {
        try {
            const res = await this.productApi.post(
                `${this.baseURL}/${productId}/variants`,
                data
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to create variant"
            )
        }
    }

    async uploadVariantImages(
        variantId: string,
        images: UploadVariantImagePayload[]
    ): Promise<{ success: boolean; images: any[] }> {
        try {
            const formData = new FormData()
            images.forEach((image) => {
                formData.append("images", image.file)
                formData.append(
                    "is_featured_one",
                    image.is_featured_one ? "true" : "false"
                )
                formData.append(
                    "is_featured_two",
                    image.is_featured_two ? "true" : "false"
                )
            })

            const res = await this.productApi.post(
                `${this.baseURL}/variants/${variantId}/images/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to upload images"
            )
        }
    }

    async addVariantImageByUrl(
        variantId: string,
        payload: {
            image_url: string
            is_featured_one: boolean
            is_featured_two: boolean
        }
    ): Promise<{ success: boolean; image: any }> {
        try {
            const res = await this.productApi.post(
                `${this.baseURL}/variants/${variantId}/images`,
                payload
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to add image by URL"
            )
        }
    }
}
