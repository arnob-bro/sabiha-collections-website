import type { AxiosInstance } from "axios"
import { api } from "./api"

import type {
    Category,
    CategoryTreeNode,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "../types/category"

import type { ApiResponse } from "../types/api"

export default class CategoryApi {
    private categoryApi: AxiosInstance
    private baseURL: string

    constructor(baseURL = import.meta.env.VITE_API_URL as string) {
        this.categoryApi = api
        this.baseURL = `${baseURL}/categories`
    }

    // GET /categories (tree)
    async getCategoryTree(): Promise<ApiResponse<CategoryTreeNode[]>> {
        try {
            const res = await this.categoryApi.get<
                ApiResponse<CategoryTreeNode[]>
            >(`${this.baseURL}`)
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to fetch category tree"
            )
        }
    }

    // GET /categories/all (flat list)
    async getAllCategories(): Promise<ApiResponse<Category[]>> {
        try {
            const res = await this.categoryApi.get<ApiResponse<Category[]>>(
                `${this.baseURL}/all`
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to fetch all categories"
            )
        }
    }

    // POST /categories (create)
    async createCategory(
        data: CreateCategoryDto
    ): Promise<ApiResponse<Category>> {
        try {
            const res = await this.categoryApi.post<ApiResponse<Category>>(
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

    // PUT /categories (update)
    async updateCategory(
        categoryId: string,
        data: UpdateCategoryDto
    ): Promise<ApiResponse<Category>> {
        try {
            const res = await this.categoryApi.put<ApiResponse<Category>>(
                `${this.baseURL}/${categoryId}`,
                data
            )
            return res.data
        } catch (err: any) {
            throw new Error(
                err.response?.data?.message || "Failed to update category"
            )
        }
    }
}
