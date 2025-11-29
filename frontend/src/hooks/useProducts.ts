import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ProductApi from "@/apiCalls/productApi"
import type { Product, CreateProductDto } from "@/types/product"

const productApi = new ProductApi()

export function useProducts() {
    const queryClient = useQueryClient()

    const productsQuery = useQuery({
        queryKey: ["products"],
        queryFn: async (): Promise<Product[]> => {
            const res = await productApi.getProducts()
            return res.data
        },
    })

    const createMutation = useMutation({
        mutationFn: (payload: CreateProductDto) =>
            productApi.createProduct(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["products"] })
        },
    })

    return {
        products: productsQuery.data ?? [],
        isLoading: productsQuery.isLoading,
        error: productsQuery.error,
        refetch: productsQuery.refetch,
        createProduct: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
    }
}

