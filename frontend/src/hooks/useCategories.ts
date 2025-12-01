import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CategoryApi from "@/apiCalls/categoryApi"
import type {
    Category,
    CategoryTreeNode,
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
            void queryClient.invalidateQueries({ queryKey: ["categoryTree"] })
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
            void queryClient.invalidateQueries({ queryKey: ["categoryTree"] })
        },
    })

    return {
        categories: categoriesQuery.data ?? [],
        isLoading: categoriesQuery.isPending,
        error: categoriesQuery.error,
        refetch: categoriesQuery.refetch,
        createCategory: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateCategory: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    }
}

/**
 * Hook to fetch the category tree (hierarchical structure with parent-child relationships)
 * Use this for navigation menus where you need to show parent categories with dropdown children
 */
export function useCategoryTree() {
    const categoryTreeQuery = useQuery({
        queryKey: ["categoryTree"],
        queryFn: async (): Promise<CategoryTreeNode[]> => {
            const res = await categoryApi.getCategoryTree()
            return res.data
        },
    })

    return {
        categoryTree: categoryTreeQuery.data ?? [],
        isLoading: categoryTreeQuery.isPending,
        error: categoryTreeQuery.error,
        refetch: categoryTreeQuery.refetch,
    }
}
