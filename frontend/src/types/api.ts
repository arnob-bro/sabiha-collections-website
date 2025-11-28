export interface ApiError {
    success: boolean
    message: string
}

// API response wrapper
export interface ApiResponse<T> {
    success: boolean
    data: T
}
