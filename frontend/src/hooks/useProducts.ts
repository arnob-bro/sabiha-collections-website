import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ProductApi from "@/apiCalls/productApi"
import type {
    CreateProductDto,
    CreateVariantDto,
    ProductListResponse,
} from "@/types/product"

const productApi = new ProductApi()

export function useProducts() {
    const queryClient = useQueryClient()

    const productsQuery = useQuery({
        queryKey: ["products"],
        queryFn: async (): Promise<ProductListResponse> => {
            const res = await productApi.getAllProducts()
            return res
        },
    })

    const productsMutation = useMutation({
        mutationFn: (payload: CreateProductDto) =>
            productApi.createProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: () => {
            console.error("failed to create product")
        },
    })

    const variantMutation = useMutation({
        mutationFn: (payload: CreateVariantDto) =>
            productApi.createVariant(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: () => {
            console.error("failed to create variant")
        },
    })

    return {
        products: productsQuery.data?.products ?? [],
        pagination: productsQuery.data?.pagination,
        isLoading: productsQuery.isPending,
        error: productsQuery.error,
        refetch: productsQuery.refetch,

        createProduct: productsMutation.mutateAsync,
        createdProduct: productsMutation.data?.product,
        isCreatingProduct: productsMutation.isPending,

        createVariant: variantMutation.mutateAsync,
        createdVariant: variantMutation.data?.variant,
        isCreatingVariant: variantMutation.isPending,
    }
}
