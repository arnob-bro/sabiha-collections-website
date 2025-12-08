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

    //* FOR CREATING a product
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

    //* FOR CREATING a variant
    const variantMutation = useMutation({
        mutationFn: ({
            productId,
            data,
        }: {
            productId: string
            data: Omit<CreateVariantDto, "product_id">
        }) => productApi.createVariant(productId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: () => {
            console.error("failed to create variant")
        },
    })

    //* FOR UPLOADING an image (file-based)
    const uploadImagesMutation = useMutation({
        mutationFn: ({
            variantId,
            images,
        }: {
            variantId: string
            images: {
                file: File
                is_featured_one: boolean
                is_featured_two: boolean
            }[]
        }) => productApi.uploadVariantImages(variantId, images),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: () => {
            console.error("failed to upload images")
        },
    })

    //* FOR ADDING an image by URL
    const addImageByUrlMutation = useMutation({
        mutationFn: ({
            variantId,
            image_url,
            is_featured_one,
            is_featured_two,
        }: {
            variantId: string
            image_url: string
            is_featured_one: boolean
            is_featured_two: boolean
        }) =>
            productApi.addVariantImageByUrl(variantId, {
                image_url,
                is_featured_one,
                is_featured_two,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: () => {
            console.error("failed to add image by url")
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

        uploadVariantImages: uploadImagesMutation.mutateAsync,
        uploadedImages: uploadImagesMutation.data?.images,
        isUploadingImages: uploadImagesMutation.isPending,

        addVariantImageByUrl: addImageByUrlMutation.mutateAsync,
    }
}
