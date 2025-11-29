import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CategoryApi from "@/apiCalls/categoryApi"
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/types/category"

const categoryApi = new CategoryApi()

export function useCategories() {
    const queryClient = useQueryClient()

    const categoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: async (): Promise<Category[]> => {
            const res = await categoryApi.getAllCategories()
            return res.data
        },
    })

    const createMutation = useMutation({
        mutationFn: (payload: CreateCategoryDto) =>
            categoryApi.createCategory(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["categories"] })
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateCategoryDto
        }) => categoryApi.updateCategory(id, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["categories"] })
        },
    })

    return {
        categories: categoriesQuery.data ?? [],
        isLoading: categoriesQuery.isLoading,
        error: categoriesQuery.error,
        refetch: categoriesQuery.refetch,
        createCategory: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateCategory: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    }
}
